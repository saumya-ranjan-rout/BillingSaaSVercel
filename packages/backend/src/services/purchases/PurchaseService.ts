import { Repository, ILike, In, IsNull } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { PurchaseOrder, PurchaseOrderStatus, PurchaseOrderType } from '../../entities/PurchaseOrder';
import { PurchaseItem } from '../../entities/PurchaseItem';
import { Vendor } from '../../entities/Vendor';
import { Product } from '../../entities/Product';
import logger from '../../utils/logger';
import { PaginatedResponse } from '../../types/customTypes';

export class PurchaseService {
  private purchaseOrderRepository: Repository<PurchaseOrder>;
  private purchaseItemRepository: Repository<PurchaseItem>;
  private vendorRepository: Repository<Vendor>;
  private productRepository: Repository<Product>;

  constructor() {
    this.purchaseOrderRepository = AppDataSource.getRepository(PurchaseOrder);
    this.purchaseItemRepository = AppDataSource.getRepository(PurchaseItem);
    this.vendorRepository = AppDataSource.getRepository(Vendor);
    this.productRepository = AppDataSource.getRepository(Product);
  }

  private generatePONumber(tenantId: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PO-${tenantId.slice(-4)}-${timestamp}-${random}`;
  }

  private calculateItemTotals(item: any) {
    const discountAmount = (item.unitPrice * item.quantity * item.discount) / 100;
    const taxableAmount = (item.unitPrice * item.quantity) - discountAmount;
    const taxAmount = (taxableAmount * item.taxRate) / 100;
    const lineTotal = taxableAmount + taxAmount;

    return {
      discountAmount,
      taxAmount,
      lineTotal,
      receivedQuantity: 0,
      isReceived: false
    };
  }

  async createPurchaseOrder(tenantId: string, purchaseData: any): Promise<PurchaseOrder> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate vendor exists
      const vendor = await this.vendorRepository.findOne({
        where: { id: purchaseData.vendorId, tenantId, deletedAt: IsNull() }
      });

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Generate PO number
      const poNumber = this.generatePONumber(tenantId);

      // Calculate totals
      let subTotal = 0;
      let taxTotal = 0;
      let discountTotal = 0;
      const taxDetails: any[] = [];

      const items = await Promise.all(
        purchaseData.items.map(async (itemData: any) => {
          const itemTotals = this.calculateItemTotals(itemData);
          
          subTotal += itemData.unitPrice * itemData.quantity;
          discountTotal += itemTotals.discountAmount;
          taxTotal += itemTotals.taxAmount;

          // Track tax details
          const existingTax = taxDetails.find(t => t.taxRate === itemData.taxRate);
          if (existingTax) {
            existingTax.taxAmount += itemTotals.taxAmount;
          } else {
            taxDetails.push({
              taxName: `Tax ${itemData.taxRate}%`,
              taxRate: itemData.taxRate,
              taxAmount: itemTotals.taxAmount
            });
          }

          const purchaseItem = this.purchaseItemRepository.create({
            ...itemData,
            ...itemTotals,
            tenantId
          });

          return purchaseItem;
        })
      );

      const totalAmount = subTotal - discountTotal + taxTotal;

      const purchaseOrder = this.purchaseOrderRepository.create({
        poNumber,
        vendorId: purchaseData.vendorId,
        type: purchaseData.type,
        orderDate: purchaseData.orderDate,
        expectedDeliveryDate: purchaseData.expectedDeliveryDate,
        shippingAddress: purchaseData.shippingAddress,
        billingAddress: purchaseData.billingAddress,
        termsAndConditions: purchaseData.termsAndConditions,
        notes: purchaseData.notes,
        subTotal,
        taxTotal,
        discountTotal,
        totalAmount,
        balanceDue: totalAmount,
        taxDetails,
        items,
        tenantId
      });

      const savedPO = await queryRunner.manager.save(purchaseOrder);
      
      // Update vendor outstanding balance
      vendor.outstandingBalance = Number(vendor.outstandingBalance) + totalAmount;
      await queryRunner.manager.save(vendor);

      await queryRunner.commitTransaction();
      return savedPO;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating purchase order:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getPurchaseOrder(tenantId: string, poId: string): Promise<PurchaseOrder> {
    try {
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id: poId, tenantId, deletedAt: IsNull() },
        relations: ['vendor', 'items', 'items.product']
      });

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      return purchaseOrder;
    } catch (error) {
      logger.error('Error fetching purchase order:', error);
      throw error;
    }
  }

  async getPurchaseOrders(tenantId: string, options: {
    page: number;
    limit: number;
    search?: string;
    status?: PurchaseOrderStatus;
    vendorId?: string;
  }): Promise<PaginatedResponse<PurchaseOrder>> {
    try {
      const { page, limit, search, status, vendorId } = options;
      const skip = (page - 1) * limit;

      let whereConditions: any = { tenantId, deletedAt: IsNull() };

      if (status) {
        whereConditions.status = status;
      }

      if (vendorId) {
        whereConditions.vendorId = vendorId;
      }

      if (search) {
        whereConditions = [
          { ...whereConditions, poNumber: ILike(`%${search}%`) },
          { ...whereConditions, 'vendor.name': ILike(`%${search}%`) }
        ];
      }

      const [purchaseOrders, total] = await this.purchaseOrderRepository.findAndCount({
        where: whereConditions,
        relations: ['vendor'],
        skip,
        take: limit,
        order: { createdAt: 'DESC' }
      });

      return {
        data: purchaseOrders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching purchase orders:', error);
      throw error;
    }
  }

  async updatePurchaseOrder(
  tenantId: string,
  poId: string,
  updates: any
): Promise<PurchaseOrder> {
  try {
    const purchaseOrder = await this.getPurchaseOrder(tenantId, poId);

    if (purchaseOrder.status !== PurchaseOrderStatus.DRAFT) {
      throw new Error('Only draft purchase orders can be modified');
    }

    // Remove existing items first to avoid orphan rows
    await this.purchaseItemRepository.delete({ purchaseOrder: { id: poId } });

    // Rebuild new items
    const newItems = updates.items?.map((item: any) => {
      const discountAmount = (item.unitPrice * item.quantity * (item.discount ?? 0)) / 100;
      const taxableAmount = (item.unitPrice * item.quantity) - discountAmount;
      const taxAmount = (taxableAmount * (item.taxRate ?? 0)) / 100;
      const lineTotal = taxableAmount + taxAmount;

      return this.purchaseItemRepository.create({
        ...item,
        tenantId,
        discountAmount,
        taxAmount,
        lineTotal,
        purchaseOrder, // ✅ proper relation
      });
    });

    // Assign updates to purchase order
    Object.assign(purchaseOrder, {
      ...updates,
      tenantId,
      items: newItems,
    });

    return await this.purchaseOrderRepository.save(purchaseOrder);
  } catch (error) {
    logger.error('Error updating purchase order:', error);
    throw error;
  }
}


  //async updatePurchaseOrder(tenantId: string, poId: string, updates: any): Promise<PurchaseOrder> {
//     // console.log("hi updatePurchaseOrder Service");
//      //console.log(updates);
//     // console.log(tenantId);
//     // console.log(poId);

//     try {
//       const purchaseOrder = await this.getPurchaseOrder(tenantId, poId);

//       if (purchaseOrder.status !== PurchaseOrderStatus.DRAFT) {
//         throw new Error('Only draft purchase orders can be modified');
//       }

// const mergedUpdates = {
//   ...updates,
//   tenantId,
//   items: updates.items?.map((item: any) => {
//     const discountAmount = (item.unitPrice * item.quantity * (item.discount ?? 0)) / 100;
//     const taxableAmount = (item.unitPrice * item.quantity) - discountAmount;
//     const taxAmount = (taxableAmount * (item.taxRate ?? 0)) / 100;
//     const lineTotal = taxableAmount + taxAmount;

//     return this.purchaseItemRepository.create({
//       ...item,
//       tenantId,
//       discountAmount,
//       taxAmount,
//       lineTotal,
//       purchaseOrder, // ✅ relation, not just ID
//     });
//   }),
// }

// console.log("mergedUpdates",mergedUpdates);

//     Object.assign(purchaseOrder, mergedUpdates);
      

//      // Object.assign(purchaseOrder, updates);

//      console.log("updated purchase order",purchaseOrder);
//       return await this.purchaseOrderRepository.save(purchaseOrder);
//     } catch (error) {
//       logger.error('Error updating purchase order:', error);
//       throw error;
//     }
//   }

  async updatePurchaseOrderStatus(tenantId: string, poId: string, status: PurchaseOrderStatus): Promise<PurchaseOrder> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const purchaseOrder = await this.getPurchaseOrder(tenantId, poId);

      // Handle status transitions
      if (status === PurchaseOrderStatus.RECEIVED && purchaseOrder.status !== PurchaseOrderStatus.ORDERED) {
        throw new Error('Only ordered purchase orders can be marked as received');
      }

      purchaseOrder.status = status;

      if (status === PurchaseOrderStatus.RECEIVED) {
        purchaseOrder.actualDeliveryDate = new Date();
        
        // Update inventory for product items
        for (const item of purchaseOrder.items) {
          if (item.productId && purchaseOrder.type === PurchaseOrderType.PRODUCT) {
            const product = await this.productRepository.findOne({
              where: { id: item.productId, tenantId }
            });

            if (product) {
              product.stockQuantity = Number(product.stockQuantity) + Number(item.quantity);
              await queryRunner.manager.save(product);
            }
          }
        }
      }

      const updatedPO = await queryRunner.manager.save(purchaseOrder);
      await queryRunner.commitTransaction();
      return updatedPO;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error updating purchase order status:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deletePurchaseOrder(tenantId: string, poId: string): Promise<void> {
    try {
      const purchaseOrder = await this.getPurchaseOrder(tenantId, poId);

      if (purchaseOrder.status !== PurchaseOrderStatus.DRAFT) {
        throw new Error('Only draft purchase orders can be deleted');
      }

      purchaseOrder.deletedAt = new Date();
      await this.purchaseOrderRepository.save(purchaseOrder);
    } catch (error) {
      logger.error('Error deleting purchase order:', error);
      throw error;
    }
  }

  async getVendorPurchaseOrders(tenantId: string, vendorId: string): Promise<PurchaseOrder[]> {
    try {
      const purchaseOrders = await this.purchaseOrderRepository.find({
        where: { tenantId, vendorId, deletedAt: IsNull() },
        relations: ['items'],
        order: { createdAt: 'DESC' }
      });

      return purchaseOrders;
    } catch (error) {
      logger.error('Error fetching vendor purchase orders:', error);
      throw error;
    }
  }

  async getPurchaseOrderSummary(tenantId: string): Promise<any> {
    try {
      const summary = await this.purchaseOrderRepository
        .createQueryBuilder('po')
        .select('po.status', 'status')
        .addSelect('COUNT(po.id)', 'count')
        .addSelect('SUM(po.totalAmount)', 'totalAmount')
        .where('po.tenantId = :tenantId', { tenantId })
        .andWhere('po.deletedAt IS NULL')
        .groupBy('po.status')
        .getRawMany();

      return summary;
    } catch (error) {
      logger.error('Error fetching purchase order summary:', error);
      throw error;
    }
  }
}
