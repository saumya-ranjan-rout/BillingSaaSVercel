import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { PurchaseOrder, PurchaseOrderStatus } from '../../entities/PurchaseOrder';
import { PurchaseOrderItem } from '../../entities/PurchaseOrderItem';
import { VendorService } from './VendorService';
import { GSTCalculationService } from '../billing/GSTCalculationService';
import logger from '../../utils/logger';

export class PurchaseOrderService {
  private poRepository: Repository<PurchaseOrder>;
  private poItemRepository: Repository<PurchaseOrderItem>;
  private vendorService: VendorService;
  private gstCalculationService: GSTCalculationService;

  constructor() {
    this.poRepository = AppDataSource.getRepository(PurchaseOrder);
    this.poItemRepository = AppDataSource.getRepository(PurchaseOrderItem);
    this.vendorService = new VendorService();
    this.gstCalculationService = new GSTCalculationService();
  }

  async createPurchaseOrder(tenantId: string, poData: any): Promise<PurchaseOrder> {
    try {
      // Verify vendor exists
      await this.vendorService.getVendor(tenantId, poData.vendorId);

      // Calculate totals
      const { subtotal, taxAmount, totalAmount } = await this.calculatePOTotals(poData.items);

      // Generate PO number
      const poNumber = this.generatePONumber();

      const purchaseOrder = this.poRepository.create({
        ...poData,
        poNumber,
        subtotal,
        taxAmount,
        totalAmount,
        tenantId,
        status: PurchaseOrderStatus.DRAFT
      });

      const savedPO = await this.poRepository.save(purchaseOrder);

      // Save items
      if (poData.items && poData.items.length > 0) {
        const items = poData.items.map((item: any) => ({
          ...item,
          purchaseOrderId: savedPO.id
        }));

        await this.poItemRepository.save(items);
      }

      return await this.getPurchaseOrder(tenantId, savedPO.id);
    } catch (error) {
      logger.error('Error creating purchase order:', error);
      throw error;
    }
  }

  async getPurchaseOrder(tenantId: string, poId: string): Promise<PurchaseOrder> {
    try {
      const po = await this.poRepository.findOne({
        where: { id: poId, tenantId },
        relations: ['vendor', 'items']
      });

      if (!po) {
        throw new Error('Purchase order not found');
      }

      return po;
    } catch (error) {
      logger.error('Error fetching purchase order:', error);
      throw error;
    }
  }

  async getPurchaseOrders(tenantId: string, options: {
    page: number;
    limit: number;
    status?: PurchaseOrderStatus;
    vendorId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any> {
    try {
      const { page, limit, status, vendorId, startDate, endDate } = options;
      const skip = (page - 1) * limit;

      let query = this.poRepository
        .createQueryBuilder('po')
        .leftJoinAndSelect('po.vendor', 'vendor')
        .where('po.tenantId = :tenantId', { tenantId });

      if (status) {
        query = query.andWhere('po.status = :status', { status });
      }

      if (vendorId) {
        query = query.andWhere('po.vendorId = :vendorId', { vendorId });
      }

      if (startDate) {
        query = query.andWhere('po.orderDate >= :startDate', { startDate });
      }

      if (endDate) {
        query = query.andWhere('po.orderDate <= :endDate', { endDate });
      }

      const [purchaseOrders, total] = await query
        .skip(skip)
        .take(limit)
        .orderBy('po.orderDate', 'DESC')
        .getManyAndCount();

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

  async updatePurchaseOrderStatus(
    tenantId: string, 
    poId: string, 
    status: PurchaseOrderStatus
  ): Promise<PurchaseOrder> {
    try {
      await this.poRepository.update(
        { id: poId, tenantId },
        { status }
      );

      return await this.getPurchaseOrder(tenantId, poId);
    } catch (error) {
      logger.error('Error updating purchase order status:', error);
      throw error;
    }
  }

  async deletePurchaseOrder(tenantId: string, poId: string): Promise<void> {
    try {
      await this.poRepository.delete({ id: poId, tenantId });
    } catch (error) {
      logger.error('Error deleting purchase order:', error);
      throw error;
    }
  }

  private async calculatePOTotals(items: any[]): Promise<{
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
  }> {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    // For purchases, we might need different GST calculation logic
    const taxAmount = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice * (item.taxRate / 100));
    }, 0);

    const totalAmount = subtotal + taxAmount;

    return { subtotal, taxAmount, totalAmount };
  }

  private generatePONumber(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `PO-${timestamp}-${random}`;
  }
}
