import { Repository, ILike, Between, IsNull, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Invoice, InvoiceStatus, InvoiceType, PaymentTerms } from '../../entities/Invoice';
import { Setting } from '../../entities/Setting';
import { InvoiceItem } from '../../entities/InvoiceItem';
import { PaymentInvoice, PaymentMethod, PaymentStatus } from '../../entities/PaymentInvoice';
import { Customer } from '../../entities/Customer';
import { Product, ProductType } from '../../entities/Product';
import logger from '../../utils/logger';
import { PaginatedResponse } from '../../types/customTypes';
import PDFDocument from "pdfkit";
// import { GSTCalculationService } from '../billing/GSTCalculationService';
import { LoyaltyService } from '../loyalty/LoyaltyService';
import { CacheService } from '../cache/CacheService';
import { TaxDetail } from '../../entities/TaxDetail';
//Newly added
import fs from 'fs';
import path from 'path';


export class InvoiceService {
  private invoiceRepository: Repository<Invoice>;
  private invoiceItemRepository: Repository<InvoiceItem>;
  private paymentRepository: Repository<PaymentInvoice>;
  private customerRepository: Repository<Customer>;
  private productRepository: Repository<Product>;
  private taxDetailRepository: Repository<TaxDetail>;
  private loyaltyService: LoyaltyService;
  private cacheService: CacheService;

  

  constructor() {
    this.invoiceRepository = AppDataSource.getRepository(Invoice);
    this.invoiceItemRepository = AppDataSource.getRepository(InvoiceItem);
    this.paymentRepository = AppDataSource.getRepository(PaymentInvoice);
    this.customerRepository = AppDataSource.getRepository(Customer);
    this.productRepository = AppDataSource.getRepository(Product);
    this.taxDetailRepository = AppDataSource.getRepository(TaxDetail);
    this.loyaltyService = new LoyaltyService();
    this.cacheService = new CacheService();

  }


    async getInvoicesWithKeysetPagination(
    tenantId: string,
    options: {
      cursor?: string;
      limit?: number;
      search?: string;
      status?: InvoiceStatus;
      customerId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{ data: Invoice[]; nextCursor: string | null; hasMore: boolean }> {
    const {
      cursor,
      limit = 20,
      search,
      status,
      customerId,
      startDate,
      endDate,
    } = options;

    const take = Math.min(limit, 100); // Prevent excessive loads
    
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .where('invoice.tenantId = :tenantId', { tenantId })
      .andWhere('invoice.deletedAt IS NULL')
      // Select only fields needed for list view - NO ITEMS
      .select([
        'invoice.id',
        'invoice.invoiceNumber',
        'invoice.customerId',
        'invoice.status',
        'invoice.type',
        'invoice.issueDate',
        'invoice.dueDate',
        'invoice.totalAmount',
        'invoice.balanceDue',
        'invoice.createdAt',
        'customer.id',
        'customer.name',
        'customer.email'
      ])
      .orderBy('invoice.createdAt', 'DESC')
      .addOrderBy('invoice.id', 'DESC')
      .take(take);

    // Keyset pagination
    if (cursor) {
      const [cursorDate, cursorId] = cursor.split('_');
      queryBuilder.andWhere(
        '(invoice.createdAt < :cursorDate OR (invoice.createdAt = :cursorDate AND invoice.id < :cursorId))',
        { cursorDate: new Date(cursorDate), cursorId }
      );
    }

    if (search) {
      queryBuilder.andWhere('(invoice.invoiceNumber ILIKE :search OR customer.name ILIKE :search)', {
        search: `%${search}%`
      });
    }

    if (status) {
      queryBuilder.andWhere('invoice.status = :status', { status });
    }

    if (customerId) {
      queryBuilder.andWhere('invoice.customerId = :customerId', { customerId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('invoice.issueDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    }

    const data = await queryBuilder.getMany();
    
    const nextCursor = data.length === take 
      ? `${data[data.length - 1].createdAt.toISOString()}_${data[data.length - 1].id}`
      : null;

    return {
      data,
      nextCursor,
      hasMore: nextCursor !== null
    };
  }

  /**
   * Get single invoice with full details - only when needed
   */
  async getInvoiceWithDetails(tenantId: string, invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId, tenantId, deletedAt: IsNull() },
      relations: [
        'customer', 
        'items', 
        'items.product', 
        'payments', 
        'taxDetails',
        'gstin'
      ], // Load relations only for detail view
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return invoice;
  }

  /**
   * Get invoices for list view - lightweight without items
   */
  async getInvoicesForListView(
    tenantId: string,
    options: {
      page?: number;
      limit?: number;
      search?: string;
      status?: InvoiceStatus;
      customerId?: string;
    }
  ): Promise<{ data: Invoice[]; total: number }> {
    const { page = 1, limit = 20, search, status, customerId } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .where('invoice.tenantId = :tenantId', { tenantId })
      .andWhere('invoice.deletedAt IS NULL')
      // Select only fields needed for list view
      .select([
        'invoice.id',
        'invoice.invoiceNumber',
        'invoice.customerId',
        'invoice.status',
        'invoice.type',
        'invoice.issueDate',
        'invoice.dueDate',
        'invoice.totalAmount',
        'invoice.balanceDue',
        'invoice.createdAt',
        'customer.name',
        'customer.email'
      ])
      .orderBy('invoice.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      queryBuilder.andWhere('(invoice.invoiceNumber ILIKE :search OR customer.name ILIKE :search)', {
        search: `%${search}%`
      });
    }

    if (status) {
      queryBuilder.andWhere('invoice.status = :status', { status });
    }

    if (customerId) {
      queryBuilder.andWhere('invoice.customerId = :customerId', { customerId });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

    private safeNumber(value: any, defaultValue = 0): number {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : defaultValue;
  }

  /**
   * Round to 2 decimal places to avoid floating point precision issues
   */
  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  private generateInvoiceNumber(tenantId: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${tenantId.slice(-4)}-${timestamp}-${random}`;
  }


private calculateDueDate(issueDate: Date, paymentTerms: PaymentTerms): Date {
    const dueDate = new Date(issueDate);
    switch (paymentTerms) {
      case PaymentTerms.DUE_ON_RECEIPT:
        dueDate.setDate(dueDate.getDate());
        break;
      case PaymentTerms.NET_7:
        dueDate.setDate(dueDate.getDate() + 7);
        break;
      case PaymentTerms.NET_15:
        dueDate.setDate(dueDate.getDate() + 15);
        break;
      case PaymentTerms.NET_30:
        dueDate.setDate(dueDate.getDate() + 30);
        break;
      case PaymentTerms.NET_60:
        dueDate.setDate(dueDate.getDate() + 60);
        break;
      default:
        dueDate.setDate(dueDate.getDate() + 15);
    }
    return dueDate;
  }



 
  private calculateItemTotals(item: any) {
    const quantity = this.safeNumber(item.quantity, 0);
    const unitPrice = this.safeNumber(item.unitPrice, 0);
    const discount = this.safeNumber(item.discount, 0);
    const taxRate = this.safeNumber(item.taxRate, 0);
 
    // Ensure these are numbers, not strings
    const itemTotal = quantity * unitPrice;
    const discountAmount = this.roundToTwoDecimals(itemTotal * (discount / 100));
    const taxableAmount = this.roundToTwoDecimals(itemTotal - discountAmount);
    const taxAmount = this.roundToTwoDecimals(taxableAmount * (taxRate / 100));
    const lineTotal = this.roundToTwoDecimals(taxableAmount + taxAmount);
 
    return {
        discountAmount,
        taxAmount,
        lineTotal,
        taxableAmount
    };
}
  private async safeProcessLoyalty(invoiceId: string): Promise<void> {
    try {
      // Add delay to ensure invoice is fully committed
      setTimeout(async () => {
        try {
          await this.loyaltyService.processInvoiceForLoyalty(invoiceId);
          logger.info(`Loyalty processing completed for invoice: ${invoiceId}`);
        } catch (loyaltyError) {
          logger.error('Loyalty processing failed (non-critical):', loyaltyError);
          // Don't throw - this shouldn't fail the main invoice operation
        }
      }, 2000); // Increased delay to ensure transaction completion
    } catch (error) {
      logger.error('Error scheduling loyalty processing:', error);
    }
  }


  /**
   * Create invoice - optimized to batch product lookups to reduce DB roundtrips.
   */
   async createInvoice(tenantId: string, invoiceData: any): Promise<Invoice> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate customer exists
      const customer = await this.customerRepository.findOne({
        where: { id: invoiceData.customerId, tenantId }
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Generate invoice number
      const invoiceNumber = this.generateInvoiceNumber(tenantId);

      // Calculate due date based on payment terms
      const dueDate = this.calculateDueDate(new Date(invoiceData.issueDate), invoiceData.paymentTerms);

      // Prepare totals
      let subTotal = 0;
      let taxTotal = 0;
      let discountTotal = 0;
      const taxDetails: any[] = [];
      const discountDetails: any[] = [];

      // Batch fetch products referenced by items
      const productIds = Array.from(new Set((invoiceData.items || [])
        .map((it: any) => it.productId)
        .filter(Boolean)));

      let productsMap: Record<string, Product> = {};
      if (productIds.length) {
        const products = await this.productRepository.find({ 
          where: { id: In(productIds), tenantId } 
        });
        productsMap = products.reduce((acc, p) => { 
          acc[p.id] = p; 
          return acc; 
        }, {} as Record<string, Product>);
      }

      // Build invoice items
      const items = await Promise.all(
        (invoiceData.items || []).map(async (itemData: any) => {
          // Sanitize input values
          itemData.quantity = this.safeNumber(itemData.quantity, 0);
          itemData.unitPrice = this.safeNumber(itemData.unitPrice, 0);
          itemData.discount = this.safeNumber(itemData.discount, 0);
          itemData.taxRate = this.safeNumber(itemData.taxRate, 0);

          const itemTotals = this.calculateItemTotals(itemData);

          // Totals accumulation
          subTotal += itemData.unitPrice * itemData.quantity;
          discountTotal += itemTotals.discountAmount;
          taxTotal += itemTotals.taxAmount;

          // Track tax details
          const existingTax = taxDetails.find(t => t.taxRate === itemData.taxRate);
          if (existingTax) {
            existingTax.taxAmount += itemTotals.taxAmount;
            existingTax.taxableValue += itemTotals.taxableAmount;
          } else {
            taxDetails.push({
              taxName: `Tax ${itemData.taxRate || 0}%`,
              taxRate: itemData.taxRate || 0,
              taxAmount: itemTotals.taxAmount,
              taxableValue: itemTotals.taxableAmount
            });
          }

          // Track discount details
          if (itemData.discount > 0) {
            discountDetails.push({
              discountType: 'percentage',
              discountValue: itemData.discount,
              discountAmount: itemTotals.discountAmount
            });
          }

          const invoiceItem = this.invoiceItemRepository.create({
            ...itemData,
            ...itemTotals,
            tenantId
          });

          // Update product stock if it's a goods product
          if (itemData.productId) {
            const product = productsMap[itemData.productId];
            if (product && product.type === ProductType.GOODS) {
              if (product.stockQuantity < itemData.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
              }
              product.stockQuantity = Number(product.stockQuantity) - Number(itemData.quantity);
              await queryRunner.manager.save(product);
            }
          }

          return invoiceItem;
        })
      );

      // Calculate final totals with rounding
      subTotal = this.roundToTwoDecimals(subTotal);
      discountTotal = this.roundToTwoDecimals(discountTotal);
      taxTotal = this.roundToTwoDecimals(taxTotal);
      const totalAmount = this.roundToTwoDecimals(subTotal - discountTotal + taxTotal);
      const DueTotal = this.roundToTwoDecimals(totalAmount - invoiceData.cashBack);

      const invoice = this.invoiceRepository.create({
        invoiceNumber,
        customerId: invoiceData.customerId,
        type: invoiceData.type,
        issueDate: invoiceData.issueDate,
        dueDate,
        paymentTerms: invoiceData.paymentTerms,
        shippingAddress: invoiceData.shippingAddress,
        billingAddress: invoiceData.billingAddress,
        termsAndConditions: invoiceData.termsAndConditions,
        notes: invoiceData.notes,
        subTotal,
        taxTotal,
        discountTotal,
        totalAmount,
        balanceDue: DueTotal,
        taxDetails,
        discountDetails,
        isRecurring: invoiceData.isRecurring || false,
        recurringSettings: invoiceData.recurringSettings,
        items,
        tenantId
      });

      const savedInvoice = await queryRunner.manager.save(invoice);
      if(invoiceData.cashBack > 0){
          await this.loyaltyService.redeemCashback(tenantId,invoiceData.customerId,invoiceData.cashBack);
      }

      // Update customer credit balance
      customer.creditBalance = this.roundToTwoDecimals(Number(customer.creditBalance) + totalAmount);
      await queryRunner.manager.save(customer);

      // Invalidate caches in parallel
      await Promise.all([
        this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
        this.cacheService.invalidatePattern(`dashboard:${tenantId}`)
      ]);

      await queryRunner.commitTransaction();

      // Process loyalty asynchronously (non-blocking)
      this.safeProcessLoyalty(savedInvoice.id);

      return savedInvoice;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating invoice:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }





  
  /**
   * Update invoice - optimized batch product fetch and parallel saves where safe.
   */

  async updateInvoice(tenantId: string, invoiceId: string, invoiceData: any): Promise<Invoice> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Fetch existing invoice with items + tax details
      const invoice = await this.getInvoice(tenantId, invoiceId);
      if (![InvoiceStatus.DRAFT, InvoiceStatus.PARTIAL].includes(invoice.status)) {
        throw new Error('Only draft or partial invoices can be updated');
      }

      // Validate customer
      const customer = await this.customerRepository.findOne({
        where: { id: invoiceData.customerId, tenantId }
      });
      if (!customer) throw new Error('Customer not found');

      // Collect all productIds (old + new)
      const oldProductIds = (invoice.items || []).map(it => it.productId).filter(Boolean);
      const newProductIds = (invoiceData.items || []).map((it: any) => it.productId).filter(Boolean);
      const allProductIds = Array.from(new Set([...oldProductIds, ...newProductIds]));

      let productsMap: Record<string, Product> = {};
      if (allProductIds.length) {
        const products = await this.productRepository.find({ 
          where: { id: In(allProductIds), tenantId } 
        });
        productsMap = products.reduce((acc, p) => { 
          acc[p.id] = p; 
          return acc; 
        }, {} as Record<string, Product>);
      }

      // Reverse stock for old items
      for (const oldItem of invoice.items) {
        if (oldItem.productId) {
          const product = productsMap[oldItem.productId];
          if (product && product.type === ProductType.GOODS) {
            product.stockQuantity += this.safeNumber(oldItem.quantity);
            await queryRunner.manager.save(product);
          }
        }
      }

      // Remove old items and old tax details
      await queryRunner.manager.remove(InvoiceItem, invoice.items || []);
      await queryRunner.manager.remove(TaxDetail, invoice.taxDetails || []);

      // Recalculate totals
      let subTotal = 0;
      let taxTotal = 0;
      let discountTotal = 0;
      const taxDetailsData: any[] = [];
      const discountDetails: any[] = [];

      const newItems = await Promise.all(
        (invoiceData.items || []).map(async (itemData: any) => {
          // Sanitize inputs
          itemData.quantity = this.safeNumber(itemData.quantity, 0);
          itemData.unitPrice = this.safeNumber(itemData.unitPrice, 0);
          itemData.discount = this.safeNumber(itemData.discount, 0);
          itemData.taxRate = this.safeNumber(itemData.taxRate, 0);

          const itemTotals = this.calculateItemTotals(itemData);

          // Ensure safe totals
          const discountAmount = this.safeNumber(itemTotals.discountAmount);
          const taxAmount = this.safeNumber(itemTotals.taxAmount);
          const taxableAmount = this.safeNumber(itemTotals.taxableAmount);

          // Accumulate totals
          subTotal += itemData.unitPrice * itemData.quantity;
          discountTotal += discountAmount;
          taxTotal += taxAmount;

          // Track tax details safely
          const existingTax = taxDetailsData.find(t => t.taxRate === itemData.taxRate);
          if (existingTax) {
            existingTax.taxAmount += taxAmount;
            existingTax.taxableValue += taxableAmount;
          } else {
            taxDetailsData.push({
              taxName: `Tax ${itemData.taxRate}%`,
              taxRate: itemData.taxRate,
              taxAmount,
              taxableValue: taxableAmount
            });
          }

          // Track discount details safely
          if (itemData.discount > 0) {
            discountDetails.push({
              discountType: 'percentage',
              discountValue: itemData.discount,
              discountAmount
            });
          }

          const invoiceItem = this.invoiceItemRepository.create({
            ...itemData,
            ...itemTotals,
            discountAmount,
            taxAmount,
            taxableAmount,
            tenantId
          });

          // Deduct stock
          if (itemData.productId) {
            const product = productsMap[itemData.productId];
            if (product && product.type === ProductType.GOODS) {
              if (product.stockQuantity < itemData.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
              }
              product.stockQuantity -= itemData.quantity;
              await queryRunner.manager.save(product);
            }
          }

          return invoiceItem;
        })
      );

      // Calculate final totals with rounding
      subTotal = this.roundToTwoDecimals(subTotal);
      discountTotal = this.roundToTwoDecimals(discountTotal);
      taxTotal = this.roundToTwoDecimals(taxTotal);
      const totalAmount = this.roundToTwoDecimals(subTotal - discountTotal + taxTotal);
      const amountPaid = this.safeNumber(invoice.amountPaid);

      // Adjust customer credit balance
      const creditAdjustment = totalAmount - this.safeNumber(invoice.totalAmount);
      customer.creditBalance = this.roundToTwoDecimals(Number(customer.creditBalance) + creditAdjustment);
      await queryRunner.manager.save(customer);

      // Update invoice fields
      invoice.customerId = invoiceData.customerId;
      invoice.type = invoiceData.type;
      invoice.issueDate = invoiceData.issueDate;
      invoice.dueDate = this.calculateDueDate(new Date(invoiceData.issueDate), invoiceData.paymentTerms);
      invoice.paymentTerms = invoiceData.paymentTerms;
      invoice.shippingAddress = invoiceData.shippingAddress;
      invoice.billingAddress = invoiceData.billingAddress;
      invoice.termsAndConditions = invoiceData.termsAndConditions;
      invoice.notes = invoiceData.notes;
      invoice.subTotal = subTotal;
      invoice.taxTotal = taxTotal;
      invoice.discountTotal = discountTotal;
      invoice.totalAmount = totalAmount;
      invoice.balanceDue = this.roundToTwoDecimals(totalAmount - amountPaid-invoiceData.cashBack);
      invoice.discountDetails = discountDetails;
      invoice.items = newItems;

      const savedInvoice = await queryRunner.manager.save(invoice);
    if(invoiceData.cashBack > 0){
          await this.loyaltyService.redeemCashback(tenantId,invoiceData.customerId,invoiceData.cashBack);
      }
      

      // Create new tax details with valid invoiceId
      const taxDetailEntities: TaxDetail[] = this.taxDetailRepository.create(
        taxDetailsData.map(td => ({
          ...td,
          tenantId,
          invoice: savedInvoice
        }))
      );

      await queryRunner.manager.save(taxDetailEntities);

      // Assign back to invoice object
      savedInvoice.taxDetails = taxDetailEntities;

      // Invalidate cache
      await Promise.all([
        this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
        this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
        this.cacheService.invalidatePattern(`dashboard:${tenantId}`)
      ]);

      await queryRunner.commitTransaction();

      // Re-process loyalty asynchronously
      this.safeProcessLoyalty(savedInvoice.id);

      return savedInvoice;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error updating invoice:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


 

  async getInvoice(tenantId: string, invoiceId: string): Promise<Invoice> {
    //console.log("getInvoice_service",{tenantId,invoiceId});
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id: invoiceId, tenantId, deletedAt: IsNull() },
        relations: ['customer', 'items', 'items.product', 'payments', 'taxDetails']
      });

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      return invoice;
    } catch (error) {
      logger.error('Error fetching invoice:', error);
      throw error;
    }
  }


  async getInvoices(tenantId: string, options: {
    page: number;
    limit: number;
    search?: string;
    status?: InvoiceStatus;
    type?: InvoiceType;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<PaginatedResponse<Invoice>> {
    const cacheKey = `invoices:${tenantId}:${JSON.stringify(options)}`;

    return await this.cacheService.getOrSet(cacheKey, async () => {
      const { page, limit, search, status, type, customerId, startDate, endDate } = options;
      const skip = (page - 1) * limit;

      let whereConditions: any = { tenantId, deletedAt: IsNull() };

      if (status) {
        whereConditions.status = status;
      }

      if (type) {
        whereConditions.type = type;
      }

      if (customerId) {
        whereConditions.customerId = customerId;
      }

      if (startDate && endDate) {
        whereConditions.issueDate = Between(startDate, endDate);
      } else if (startDate) {
        whereConditions.issueDate = MoreThanOrEqual(startDate);
      } else if (endDate) {
        whereConditions.issueDate = LessThanOrEqual(endDate);
      }

      if (search) {
        whereConditions = [
          { ...whereConditions, invoiceNumber: ILike(`%${search}%`) },
          { ...whereConditions, 'customer.name': ILike(`%${search}%`) }
        ];
      }

      const [invoices, total] = await this.invoiceRepository.findAndCount({
        where: whereConditions,
        relations: ['customer', 'items', 'items.product'],
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        cache: 30000
      });

      return {
        data: invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    }, 60);
  }

  async updateInvoiceStatus(tenantId: string, invoiceId: string, status: InvoiceStatus): Promise<Invoice> {
    try {
      const invoice = await this.getInvoice(tenantId, invoiceId);

      if (status === InvoiceStatus.SENT) {
        invoice.sentAt = new Date();
      } else if (status === InvoiceStatus.VIEWED) {
        invoice.viewedAt = new Date();
      } else if (status === InvoiceStatus.PAID && invoice.balanceDue === 0) {
        invoice.paidDate = new Date();
      }

      invoice.status = status;
      return await this.invoiceRepository.save(invoice);
    } catch (error) {
      logger.error('Error updating invoice status:', error);
      throw error;
    }
  }

   async addPayment(tenantId: string, paymentData: Partial<PaymentInvoice>): Promise<PaymentInvoice> {
    if (!paymentData.invoiceId) throw new Error('invoiceId is required');
    if (paymentData.amount === undefined) throw new Error('amount is required');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoice = await this.getInvoice(tenantId, paymentData.invoiceId);
      const customer = await this.customerRepository.findOne({
        where: { id: invoice.customerId, tenantId }
      });

      if (!customer) throw new Error('Customer not found');

      const paymentAmount = this.safeNumber(paymentData.amount);
      if (paymentAmount > invoice.balanceDue) {
        throw new Error('Payment amount exceeds invoice balance');
      }

      const payment = this.paymentRepository.create({
        ...paymentData,
        amount: paymentAmount,
        customerId: invoice.customerId,
        status: PaymentStatus.COMPLETED,
        tenantId
      });

      const savedPayment = await queryRunner.manager.save(payment);

      invoice.amountPaid = this.roundToTwoDecimals(Number(invoice.amountPaid) + paymentAmount);
      invoice.balanceDue = this.roundToTwoDecimals(Number(invoice.balanceDue) - paymentAmount);

      if (invoice.balanceDue === 0) {
        invoice.status = InvoiceStatus.PAID;
        invoice.paidDate = new Date();
      } else if (invoice.amountPaid > 0) {
        invoice.status = InvoiceStatus.PARTIAL;
      }

      await queryRunner.manager.save(invoice);

      customer.creditBalance = Math.max(0, this.roundToTwoDecimals(Number(customer.creditBalance) - paymentAmount));
      await queryRunner.manager.save(customer);

      await queryRunner.commitTransaction();

      return await this.paymentRepository.findOneOrFail({
        where: { id: savedPayment.id },
        relations: ['invoice', 'customer']
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error adding payment:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async deleteInvoice(tenantId: string, invoiceId: string): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoice = await this.getInvoice(tenantId, invoiceId);

      if (invoice.status !== InvoiceStatus.DRAFT) {
        throw new Error('Only draft invoices can be deleted');
      }

      invoice.deletedAt = new Date();
      await queryRunner.manager.save(invoice);

      const customer = await this.customerRepository.findOne({
        where: { id: invoice.customerId, tenantId }
      });

      if (customer) {
        customer.creditBalance = Math.max(0, Number(customer.creditBalance) - invoice.totalAmount);
        await queryRunner.manager.save(customer);
      }
    await Promise.all([
        this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
        this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
        this.cacheService.invalidatePattern(`dashboard:${tenantId}`)
      ]);
      
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error deleting invoice:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
 async getOrCreateCustomerByEmail(
  tenantId: string,
  name?: string,
  email?: string
) {
  // prefer lookup by email when provided
  if (email) {
    const existingByEmail = await this.customerRepository.findOne({
      where: { email, tenant: { id: tenantId } },
    });
    if (existingByEmail) return existingByEmail;
  }

  // create new customer
  const newCustomer = this.customerRepository.create({
    tenant: { id: tenantId },         // relation instead of tenantId
    name: name || 'Unknown Customer',
    email: email || undefined,        // no `null` here
  });

  await this.customerRepository.save(newCustomer);
  return newCustomer;
}
  async getCustomerInvoices(tenantId: string, customerId: string): Promise<Invoice[]> {
    try {
      const invoices = await this.invoiceRepository.find({
        where: { tenantId, customerId, deletedAt: IsNull() },
        relations: ['items'],
        order: { createdAt: 'DESC' }
      });

      return invoices;
    } catch (error) {
      logger.error('Error fetching customer invoices:', error);
      throw error;
    }
  }

  async getOverdueInvoices(tenantId: string): Promise<Invoice[]> {
    try {
      const today = new Date();
      const invoices = await this.invoiceRepository.find({
        where: {
          tenantId,
          status: In([InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.PARTIAL]),
          dueDate: LessThanOrEqual(today),
          balanceDue: MoreThanOrEqual(0.01),
          deletedAt: IsNull()
        },
        relations: ['customer'],
        order: { dueDate: 'ASC' }
      });

      return invoices;
    } catch (error) {
      logger.error('Error fetching overdue invoices:', error);
      throw error;
    }
  }

  async getInvoiceSummary(tenantId: string): Promise<any> {
    try {
      const summary = await this.invoiceRepository
        .createQueryBuilder('invoice')
        .select('invoice.status', 'status')
        .addSelect('COUNT(invoice.id)', 'count')
        .addSelect('SUM(invoice.totalAmount)', 'totalAmount')
        .addSelect('SUM(invoice.balanceDue)', 'totalBalanceDue')
        .where('invoice.tenantId = :tenantId', { tenantId })
        .andWhere('invoice.deletedAt IS NULL')
        .groupBy('invoice.status')
        .getRawMany();

      return summary;
    } catch (error) {
      logger.error('Error fetching invoice summary:', error);
      throw error;
    }
  }

  async sendInvoice(tenantId: string, invoiceId: string): Promise<Invoice> {
    try {
      const invoice = await this.getInvoice(tenantId, invoiceId);

      if (invoice.status !== InvoiceStatus.DRAFT) {
        throw new Error('Only draft invoices can be sent');
      }

      invoice.status = InvoiceStatus.SENT;
      invoice.sentAt = new Date();

      return await this.invoiceRepository.save(invoice);
    } catch (error) {
      logger.error('Error sending invoice:', error);
      throw error;
    }
  }

  async getSalesReport(
    tenantId: string,
    { startDate, endDate }: { startDate?: string; endDate?: string }
  ) {
    const query = this.invoiceRepository
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.customer", "customer")
      .where("invoice.tenantId = :tenantId", { tenantId });

    if (startDate) {
      query.andWhere("invoice.issueDate >= :startDate", { startDate });
    }
    if (endDate) {
      query.andWhere("invoice.issueDate <= :endDate", { endDate });
    }

    query.andWhere("invoice.status IN (:...statuses)", {
      statuses: ["paid", "partial", "sent", "open"],
    });

    const invoices = await query.getMany();

    return {
      totalInvoices: invoices.length,
      totalSales: invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0),
      totalTax: invoices.reduce((sum, inv) => sum + Number(inv.taxTotal), 0),
      totalDiscount: invoices.reduce((sum, inv) => sum + Number(inv.discountTotal), 0),
      data: invoices.map(inv => ({
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.customer?.name || "",
        issueDate: inv.issueDate,
        totalAmount: inv.totalAmount,
        taxTotal: inv.taxTotal,
        discountTotal: inv.discountTotal,
        status: inv.status,
      })),
    };
  }

  async getGSTR1Report(
    tenantId: string,
    { startDate, endDate }: { startDate?: string; endDate?: string }
  ) {
    const query = this.invoiceRepository
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.customer", "customer")
      .leftJoinAndSelect("invoice.gstin", "gstin")
      .where("invoice.tenantId = :tenantId", { tenantId });

    if (startDate) {
      query.andWhere("invoice.issueDate >= :startDate", { startDate });
    }
    if (endDate) {
      query.andWhere("invoice.issueDate <= :endDate", { endDate });
    }

    query.andWhere("invoice.status IN (:...statuses)", {
      statuses: ["paid", "partial", "sent", "open"],
    });

    const invoices = await query.getMany();

    const b2bInvoices = invoices
      .filter(inv => inv.customer?.gstin)
      .map(inv => ({
        invoiceNumber: inv.invoiceNumber,
        issueDate: inv.issueDate,
        customerName: inv.customer?.name || "",
        customerGSTIN: inv.customer?.gstin || "",
        gstinUsed: inv.gstin?.gstin || "",
        taxableValue: Number(inv.subTotal) - Number(inv.discountTotal),
        taxAmount: Number(inv.taxTotal),
        totalAmount: Number(inv.totalAmount),
        taxDetails: inv.taxDetails || [],
      }));

    const summary = {
      totalInvoices: invoices.length,
      totalTaxableValue: invoices.reduce((sum, inv) => sum + (Number(inv.subTotal) - Number(inv.discountTotal)), 0),
      totalTaxAmount: invoices.reduce((sum, inv) => sum + Number(inv.taxTotal), 0),
      totalCessAmount: 0,
      b2bCount: b2bInvoices.length,
    };

    return {
      summary,
      b2bInvoices,
      data: invoices.map(inv => ({
        invoiceNumber: inv.invoiceNumber,
        issueDate: inv.issueDate,
        customerName: inv.customer?.name || "",
        customerGSTIN: inv.customer?.gstin || "",
        gstinUsed: inv.gstin?.gstin || "",
        totalAmount: inv.totalAmount,
        taxDetails: inv.taxDetails || [],
        category: inv.customer?.gstin ? "B2B" : "B2C",
      })),
    };
  }

  async generateInvoicePDF(invoice: Invoice, setting: Setting): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });

        // ===== WATERMARK (center logo) =====
        const watermarkPath = path.resolve(__dirname, "../../../public/logo.png");

        if (fs.existsSync(watermarkPath)) {
            // Get page width & height
            const { width, height } = doc.page;

            // Save current transparency state
            doc.save();

            // Set Opacity (10% is ideal)
            doc.opacity(0.10);

            // Insert watermark centered
            doc.image(watermarkPath, width / 2 - 150, height / 2 - 150, {
                width: 300,   // scale watermark size
                align: "center",
                valign: "center",
            });

            // Restore normal opacity
            doc.restore();
        }

        const chunks: Buffer[] = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        const toAmount = (value: any) =>
          isNaN(Number(value)) ? "0.00" : Number(value).toFixed(2);

        // ===== HEADER =====

        const logoPath = path.resolve(__dirname, "../../../public/logo.png");
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 50, 45, { width: 100 });
        }

        doc.fontSize(24)
        .font("Helvetica-Bold")
        .text("INVOICE", { align: "center", underline: true });
        doc.moveDown(1.5);

        // LEFT: Company Info
        let y = doc.y;
        doc.fontSize(10).text(setting.companyName || "", 50, y);
        doc.text(`Phone: ${setting.contactPhone || ""}`, 50);
        doc.text(`Email: ${setting.contactEmail || ""}`, 50);
        doc.text(`GSTIN: ${setting.gstNumber || ""}`, 50);

        // RIGHT: Invoice Metadata
        const issueDate = invoice.issueDate ? new Date(invoice.issueDate) : null;
        const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;

        y = 100;
        doc.text(`Invoice No: ${invoice.invoiceNumber}`, 350, y);
        if (issueDate) doc.text(`Issue Date: ${issueDate.toDateString()}`, 350);
        if (dueDate) doc.text(`Due Date: ${dueDate.toDateString()}`, 350);

        doc.moveDown(4);

        // ===== BILLING INFO =====
        doc.fontSize(12).fillColor("#333").text("Bill To:", 50, doc.y, { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor("black");
        if (invoice.customer) {
          doc.text(invoice.customer.name || "", 50);
          if (invoice.customer.email) doc.text(invoice.customer.email, 50);
        }
        if (invoice.billingAddress) doc.text(invoice.billingAddress, 50);

        doc.moveDown(2);

        // ===== ITEMS TABLE =====
        doc.fontSize(12).fillColor("#333").text("Items", 50, doc.y, { underline: true });
        doc.moveDown(0.8);

        doc.fontSize(10).fillColor("black");
        const startY = doc.y;
        doc.text("No", 50, startY);
        doc.text("Description", 90, startY);
        doc.text("Qty", 300, startY, { width: 50, align: "right" });
        doc.text("Price", 380, startY, { width: 80, align: "right" });
        doc.text("Total", 480, startY, { width: 80, align: "right" });

        doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).stroke();
        doc.moveDown(2);

        if (invoice.items?.length) {
          invoice.items.forEach((item, i) => {
            const rowY = doc.y;
            doc.text(`${i + 1}`, 50, rowY);
            doc.text(item.product?.name || item.description || "Item", 90, rowY);
            doc.text(`${item.quantity}`, 300, rowY, { width: 50, align: "right" });
            doc.text(toAmount(item.unitPrice), 380, rowY, { width: 80, align: "right" });
            doc.text(toAmount(item.lineTotal), 480, rowY, { width: 80, align: "right" });
          });
        } else {
          doc.text("No items found.", 50, doc.y);
        }

        doc.moveDown(2);

        // ===== TOTALS =====
        doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);

        const lineGap = 15;
        let ty = doc.y;

        const addLine = (label: string, value: any, bold = false) => {
          doc.font(bold ? "Helvetica-Bold" : "Helvetica");
          doc.text(label, 360, ty);
          doc.text(toAmount(value), 500, ty, { align: "right" });
          ty += lineGap;
        };

        addLine("Subtotal:", invoice.subTotal);
        addLine("Tax:", invoice.taxTotal);
        addLine("Discount:", invoice.discountTotal);
        addLine("Total:", invoice.totalAmount, true);
        addLine("Balance Due:", invoice.balanceDue, true);

        doc.font("Helvetica");
        doc.moveDown(3);

        // ===== FOOTER =====
        // Reset cursor to left margin for full-width footer
        doc.moveDown(2);
        doc.text("", 50);

        // ===== FOOTER =====
        doc.fontSize(9).fillColor("gray").text("Thank you for your business!", { align: "center" });
        if (invoice.termsAndConditions) {
          doc.moveDown(0.5);
          doc.fontSize(8).fillColor("black").text(`Terms: ${invoice.termsAndConditions}`, { align: "center" });
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async bulkCreateInvoices(tenantId: string, invoicesData: any[]): Promise<Invoice[]> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoices = this.invoiceRepository.create(
        invoicesData.map(data => ({ ...data, tenantId }))
      );

      const savedInvoices = await queryRunner.manager.save(invoices);

      // Invalidate caches in parallel
      await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);
     // await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),

      await queryRunner.commitTransaction();
      return savedInvoices;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error bulk creating invoices:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}





































 // async updateInvoice(tenantId: string, invoiceId: string, invoiceData: any): Promise<Invoice> {
  //   const queryRunner = AppDataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const sanitizeNumber = (value: any): number => {
  //       if (value === null || value === undefined || value === '') return 0;
  //       const sanitized = String(value).replace(/,/g, '').replace(/(\..*)\./g, '$1');
  //       const num = parseFloat(sanitized);
  //       if (isNaN(num)) throw new Error(`Invalid numeric value: ${value}`);
  //       return num;
  //     };

  //     // Fetch existing invoice (includes items)
  //     const invoice = await this.getInvoice(tenantId, invoiceId);

  //     if (![InvoiceStatus.DRAFT, InvoiceStatus.PARTIAL].includes(invoice.status)) {
  //       throw new Error('Only draft or partial invoices can be updated');
  //     }

  //     // Validate customer exists
  //     const customer = await this.customerRepository.findOne({
  //       where: { id: invoiceData.customerId, tenantId, deletedAt: IsNull() }
  //     });
  //     if (!customer) throw new Error('Customer not found');

  //     // Collect productIds from old items and new items for batch queries
  //     const oldProductIds = Array.from(new Set((invoice.items || []).map(it => it.productId).filter(Boolean)));
  //     const newProductIds = Array.from(new Set((invoiceData.items || []).map((it: any) => it.productId).filter(Boolean)));
  //     const allProductIds = Array.from(new Set([...oldProductIds, ...newProductIds]));

  //     let productsMap: Record<string, Product> = {};
  //     if (allProductIds.length) {
  //       const products = await this.productRepository.find({ where: { id: In(allProductIds), tenantId } });
  //       productsMap = products.reduce((acc, p) => { acc[p.id] = p; return acc; }, {} as Record<string, Product>);
  //     }

  //     // Reverse stock for old items using productsMap
  //     for (const oldItem of invoice.items) {
  //       if (oldItem.productId) {
  //         const product = productsMap[oldItem.productId];
  //         if (product && product.type === ProductType.GOODS) {
  //           product.stockQuantity += sanitizeNumber(oldItem.quantity);
  //           await queryRunner.manager.save(product);
  //         }
  //       }
  //     }

  //     // Remove old items via manager (ensure cascade / relations handled)
  //     await queryRunner.manager.remove(InvoiceItem, invoice.items);

  //     // Recalculate totals for new items
  //     let subTotal = 0;
  //     let taxTotal = 0;
  //     let discountTotal = 0;
  //     const taxDetails: any[] = [];
  //     const discountDetails: any[] = [];

  //     const newItems = await Promise.all(
  //       (invoiceData.items || []).map(async (itemData: any) => {
  //         const unitPrice = sanitizeNumber(itemData.unitPrice);
  //         const quantity = sanitizeNumber(itemData.quantity);
  //         const discount = sanitizeNumber(itemData.discount || 0);
  //         const taxRate = sanitizeNumber(itemData.taxRate || 0);

  //         const discountAmount = (unitPrice * quantity * discount) / 100;
  //         const taxableAmount = unitPrice * quantity - discountAmount;
  //         const taxAmount = (taxableAmount * taxRate) / 100;
  //         const lineTotal = taxableAmount + taxAmount;

  //         subTotal += unitPrice * quantity;
  //         discountTotal += discountAmount;
  //         taxTotal += taxAmount;

  //         const existingTax = taxDetails.find(t => t.taxRate === taxRate);
  //         if (existingTax) existingTax.taxAmount += taxAmount;
  //         else taxDetails.push({ taxName: `Tax ${taxRate}%`, taxRate, taxAmount });

  //         if (discount > 0) discountDetails.push({ discountType: 'percentage', discountValue: discount, discountAmount });

  //         const invoiceItem = this.invoiceItemRepository.create({
  //           ...itemData,
  //           unitPrice,
  //           quantity,
  //           discountAmount,
  //           taxAmount,
  //           lineTotal,
  //           tenantId
  //         });

  //         // Deduct stock for goods using productsMap
  //         if (itemData.productId) {
  //           const product = productsMap[itemData.productId];
  //        if (product && product.type === ProductType.GOODS) {
  //             if (product.stockQuantity < quantity) {
  //               throw new Error(`Insufficient stock for product: ${product.name}`);
  //             }
  //             product.stockQuantity -= quantity;
  //             await queryRunner.manager.save(product);
  //           }
  //         }

  //         return invoiceItem;
  //       })
  //     );

  //     const totalAmount = subTotal - discountTotal + taxTotal;

  //     // Update invoice fields
  //     invoice.customerId = invoiceData.customerId;
  //     invoice.type = invoiceData.type;
  //     invoice.issueDate = invoiceData.issueDate;
  //     invoice.dueDate = this.calculateDueDate(new Date(invoiceData.issueDate), invoiceData.paymentTerms);
  //     invoice.paymentTerms = invoiceData.paymentTerms;
  //     invoice.shippingAddress = invoiceData.shippingAddress;
  //     invoice.billingAddress = invoiceData.billingAddress;
  //     invoice.termsAndConditions = invoiceData.termsAndConditions;
  //     invoice.notes = invoiceData.notes;
  //     invoice.subTotal = sanitizeNumber(subTotal);
  //     invoice.taxTotal = sanitizeNumber(taxTotal);
  //     invoice.discountTotal = sanitizeNumber(discountTotal);
  //     invoice.totalAmount = sanitizeNumber(totalAmount);
  //     invoice.balanceDue = sanitizeNumber(totalAmount - (invoice.amountPaid || 0));
  //     invoice.taxDetails = taxDetails;
  //     invoice.discountDetails = discountDetails;
  //     invoice.items = newItems;

  //     const updatedInvoice = await queryRunner.manager.save(invoice);

  //     // Update customer credit balance
  //     customer.creditBalance = Math.max(0, sanitizeNumber(customer.creditBalance - invoice.balanceDue + totalAmount));
  //     await queryRunner.manager.save(customer);

  //     await queryRunner.commitTransaction();
  //     return updatedInvoice;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     logger.error('Error updating invoice:', error);
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

// import { Repository, ILike, Between,IsNull, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
// import { AppDataSource } from '../../config/database';
// import { Invoice, InvoiceStatus, InvoiceType, PaymentTerms } from '../../entities/Invoice';
// import { Setting } from '../../entities/Setting';
// import { InvoiceItem } from '../../entities/InvoiceItem';
// import { PaymentInvoice, PaymentMethod, PaymentStatus } from '../../entities/PaymentInvoice';
// import { Customer } from '../../entities/Customer';
// import { Product } from '../../entities/Product';
// import logger from '../../utils/logger';
// import { PaginatedResponse } from '../../types/customTypes';
// import PDFDocument from "pdfkit";
// import { GSTCalculationService } from '../billing/GSTCalculationService';
// import { LoyaltyService } from '../loyalty/LoyaltyService';
// import { CacheService } from '../cache/CacheService';
// // import getStream from "get-stream";

// export class InvoiceService {
//   private invoiceRepository: Repository<Invoice>;
//   private invoiceItemRepository: Repository<InvoiceItem>;
//   private paymentRepository: Repository<PaymentInvoice>;
//   private customerRepository: Repository<Customer>;
//   private productRepository: Repository<Product>;
//   private loyaltyService: LoyaltyService; 
//     private cacheService: CacheService;
//   constructor() {
//     this.invoiceRepository = AppDataSource.getRepository(Invoice);
//     this.invoiceItemRepository = AppDataSource.getRepository(InvoiceItem);
//     this.paymentRepository = AppDataSource.getRepository(PaymentInvoice);
//     this.customerRepository = AppDataSource.getRepository(Customer);
//     this.productRepository = AppDataSource.getRepository(Product);
//         this.loyaltyService = new LoyaltyService(); 
//            this.cacheService = new CacheService();
//   }

//   private generateInvoiceNumber(tenantId: string): string {
//     const timestamp = Date.now();
//     const random = Math.floor(Math.random() * 1000);
//     return `INV-${tenantId.slice(-4)}-${timestamp}-${random}`;
//   }

//   private calculateDueDate(issueDate: Date, paymentTerms: PaymentTerms): Date {
//     const dueDate = new Date(issueDate);
    
//     switch (paymentTerms) {
//       case PaymentTerms.DUE_ON_RECEIPT:
//         dueDate.setDate(dueDate.getDate());
//         break;
//       case PaymentTerms.NET_7:
//         dueDate.setDate(dueDate.getDate() + 7);
//         break;
//       case PaymentTerms.NET_15:
//         dueDate.setDate(dueDate.getDate() + 15);
//         break;
//       case PaymentTerms.NET_30:
//         dueDate.setDate(dueDate.getDate() + 30);
//         break;
//       case PaymentTerms.NET_60:
//         dueDate.setDate(dueDate.getDate() + 60);
//         break;
//       default:
//         dueDate.setDate(dueDate.getDate() + 15);
//     }
    
//     return dueDate;
//   }

//   private calculateItemTotals(item: any) {
//     const discountAmount = (item.unitPrice * item.quantity * item.discount) / 100;
//     const taxableAmount = (item.unitPrice * item.quantity) - discountAmount;
//     const taxAmount = (taxableAmount * item.taxRate) / 100;
//     const lineTotal = taxableAmount + taxAmount;

//     return {
//       discountAmount,
//       taxAmount,
//       lineTotal
//     };
//   }

//   async createInvoice(tenantId: string, invoiceData: any): Promise<Invoice> {
//     const queryRunner = AppDataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       // Validate customer exists
//       const customer = await this.customerRepository.findOne({
//         where: { id: invoiceData.customerId, tenantId, deletedAt: IsNull() }
//       });

//       if (!customer) {
//         throw new Error('Customer not found');
//       }

//       // Generate invoice number
//       const invoiceNumber = this.generateInvoiceNumber(tenantId);

//       // Calculate due date based on payment terms
//       const dueDate = this.calculateDueDate(new Date(invoiceData.issueDate), invoiceData.paymentTerms);

//       // Calculate totals
//       let subTotal = 0;
//       let taxTotal = 0;
//       let discountTotal = 0;
//       const taxDetails: any[] = [];
//       const discountDetails: any[] = [];

//       const items = await Promise.all(
//         invoiceData.items.map(async (itemData: any) => {
//           const itemTotals = this.calculateItemTotals(itemData);
          
//           subTotal += itemData.unitPrice * itemData.quantity;
//           discountTotal += itemTotals.discountAmount;
//           taxTotal += itemTotals.taxAmount;

//           // Track tax details
//           const existingTax = taxDetails.find(t => t.taxRate === itemData.taxRate);
//           if (existingTax) {
//             existingTax.taxAmount += itemTotals.taxAmount;
//           } else {
//             taxDetails.push({
//               taxName: `Tax ${itemData.taxRate}%`,
//               taxRate: itemData.taxRate,
//               taxAmount: itemTotals.taxAmount
//             });
//           }

//           // Track discount details
//           if (itemData.discount > 0) {
//             discountDetails.push({
//               discountType: 'percentage',
//               discountValue: itemData.discount,
//               discountAmount: itemTotals.discountAmount
//             });
//           }

//           const invoiceItem = this.invoiceItemRepository.create({
//             ...itemData,
//             ...itemTotals,
//             tenantId
//           });

//           // Update product stock if it's a goods product
//           if (itemData.productId) {
//             const product = await this.productRepository.findOne({
//               where: { id: itemData.productId, tenantId }
//             });

//             if (product && product.type === 'goods') {
//               if (product.stockQuantity < itemData.quantity) {
//                 throw new Error(`Insufficient stock for product: ${product.name}`);
//               }
//               product.stockQuantity = Number(product.stockQuantity) - Number(itemData.quantity);
//               await queryRunner.manager.save(product);
//             }
//           }

//           return invoiceItem;
//         })
//       );

//       const totalAmount = subTotal - discountTotal + taxTotal;

//       const invoice = this.invoiceRepository.create({
//         invoiceNumber,
//         customerId: invoiceData.customerId,
//         type: invoiceData.type,
//         issueDate: invoiceData.issueDate,
//         dueDate,
//         paymentTerms: invoiceData.paymentTerms,
//         shippingAddress: invoiceData.shippingAddress,
//         billingAddress: invoiceData.billingAddress,
//         termsAndConditions: invoiceData.termsAndConditions,
//         notes: invoiceData.notes,
//         subTotal,
//         taxTotal,
//         discountTotal,
//         totalAmount,
//         balanceDue: totalAmount,
//         taxDetails,
//         discountDetails,
//         isRecurring: invoiceData.isRecurring || false,
//         recurringSettings: invoiceData.recurringSettings,
//         items,
//         tenantId
//       });

//       const savedInvoice = await queryRunner.manager.save(invoice);

//            await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);
//       await this.cacheService.invalidatePattern(CacheService.Keys.tenantDashboard(tenantId));
      
//       // Update customer credit balance
//       customer.creditBalance = Number(customer.creditBalance) + totalAmount;
//       await queryRunner.manager.save(customer);


//     setTimeout(async () => {
//       try {
//         await this.loyaltyService.processInvoiceForLoyalty(savedInvoice.id);
//       } catch (error) {
//         logger.error('Loyalty processing error:', error);
//       }
//     }, 1000);


      
//       await queryRunner.commitTransaction();
//       return savedInvoice;
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       logger.error('Error creating invoice:', error);
//       throw error;
//     } finally {
//       await queryRunner.release();
//     }
//   }

// async updateInvoice(tenantId: string, invoiceId: string, invoiceData: any): Promise<Invoice> {
//   const queryRunner = AppDataSource.createQueryRunner();
//   await queryRunner.connect();
//   await queryRunner.startTransaction();

//   try {
//     // Helper to sanitize numeric inputs
//     const sanitizeNumber = (value: any): number => {
//       if (!value) return 0;
//       const sanitized = value.toString().replace(/,/g, '').replace(/(\..*)\./g, '$1');
//       const num = parseFloat(sanitized);
//       if (isNaN(num)) throw new Error(`Invalid numeric value: ${value}`);
//       return num;
//     };

//     // Fetch existing invoice
//     const invoice = await this.getInvoice(tenantId, invoiceId);

//     // Only allow updating DRAFT or PARTIAL invoices
//     if (![InvoiceStatus.DRAFT, InvoiceStatus.PARTIAL].includes(invoice.status)) {
//       throw new Error('Only draft or partial invoices can be updated');
//     }

//     // Validate customer exists
//     const customer = await this.customerRepository.findOne({
//       where: { id: invoiceData.customerId, tenantId, deletedAt: IsNull() }
//     });
//     if (!customer) throw new Error('Customer not found');

//     // Reverse stock for old items
//     for (const oldItem of invoice.items) {
//       if (oldItem.productId) {
//         const product = await this.productRepository.findOne({ where: { id: oldItem.productId, tenantId } });
//         if (product && product.type === 'goods') {
//           product.stockQuantity += sanitizeNumber(oldItem.quantity);
//           await queryRunner.manager.save(product);
//         }
//       }
//     }

//     // Remove old items
//     await queryRunner.manager.remove(InvoiceItem, invoice.items);

//     // Recalculate totals for new items
//     let subTotal = 0;
//     let taxTotal = 0;
//     let discountTotal = 0;
//     const taxDetails: any[] = [];
//     const discountDetails: any[] = [];

//     const newItems = await Promise.all(
//       invoiceData.items.map(async (itemData: any) => {
//         // Sanitize numeric fields
//         const unitPrice = sanitizeNumber(itemData.unitPrice);
//         const quantity = sanitizeNumber(itemData.quantity);
//         const discount = sanitizeNumber(itemData.discount || 0);
//         const taxRate = sanitizeNumber(itemData.taxRate || 0);

//         const discountAmount = (unitPrice * quantity * discount) / 100;
//         const taxableAmount = unitPrice * quantity - discountAmount;
//         const taxAmount = (taxableAmount * taxRate) / 100;
//         const lineTotal = taxableAmount + taxAmount;

//         subTotal += unitPrice * quantity;
//         discountTotal += discountAmount;
//         taxTotal += taxAmount;

//         // Track tax details
//         const existingTax = taxDetails.find(t => t.taxRate === taxRate);
//         if (existingTax) existingTax.taxAmount += taxAmount;
//         else taxDetails.push({ taxName: `Tax ${taxRate}%`, taxRate, taxAmount });

//         // Track discount details
//         if (discount > 0) discountDetails.push({ discountType: 'percentage', discountValue: discount, discountAmount });

//         // Create new invoice item
//         const invoiceItem = this.invoiceItemRepository.create({
//           ...itemData,
//           unitPrice,
//           quantity,
//           discountAmount,
//           taxAmount,
//           lineTotal,
//           tenantId
//         });

//         // Deduct stock for goods
//         if (itemData.productId) {
//           const product = await this.productRepository.findOne({ where: { id: itemData.productId, tenantId } });
//           if (product && product.type === 'goods') {
//             if (product.stockQuantity < quantity) {
//               throw new Error(`Insufficient stock for product: ${product.name}`);
//             }
//             product.stockQuantity -= quantity;
//             await queryRunner.manager.save(product);
//           }
//         }

//         return invoiceItem;
//       })
//     );

//     const totalAmount = subTotal - discountTotal + taxTotal;

//     // Update invoice fields
//     invoice.customerId = invoiceData.customerId;
//     invoice.type = invoiceData.type;
//     invoice.issueDate = invoiceData.issueDate;
//     invoice.dueDate = this.calculateDueDate(new Date(invoiceData.issueDate), invoiceData.paymentTerms);
//     invoice.paymentTerms = invoiceData.paymentTerms;
//     invoice.shippingAddress = invoiceData.shippingAddress;
//     invoice.billingAddress = invoiceData.billingAddress;
//     invoice.termsAndConditions = invoiceData.termsAndConditions;
//     invoice.notes = invoiceData.notes;
//     invoice.subTotal = sanitizeNumber(subTotal);
//     invoice.taxTotal = sanitizeNumber(taxTotal);
//     invoice.discountTotal = sanitizeNumber(discountTotal);
//     invoice.totalAmount = sanitizeNumber(totalAmount);
//     invoice.balanceDue = sanitizeNumber(totalAmount - invoice.amountPaid);
//     invoice.taxDetails = taxDetails;
//     invoice.discountDetails = discountDetails;
//     invoice.items = newItems;

//     const updatedInvoice = await queryRunner.manager.save(invoice);

//     // Update customer credit balance
//     customer.creditBalance = Math.max(0, sanitizeNumber(customer.creditBalance - invoice.balanceDue + totalAmount));
//     await queryRunner.manager.save(customer);

//     await queryRunner.commitTransaction();
//     return updatedInvoice;
//   } catch (error) {
//     await queryRunner.rollbackTransaction();
//     logger.error('Error updating invoice:', error);
//     throw error;
//   } finally {
//     await queryRunner.release();
//   }
// }



//   async getInvoice(tenantId: string, invoiceId: string): Promise<Invoice> {
//     try {
//       const invoice = await this.invoiceRepository.findOne({
//         where: { id: invoiceId, tenantId, deletedAt: IsNull() },
//         relations: ['customer', 'items', 'items.product', 'payments']
//       });

//       if (!invoice) {
//         throw new Error('Invoice not found');
//       }

//       return invoice;
//     } catch (error) {
//       logger.error('Error fetching invoice:', error);
//       throw error;
//     }
//   }

//   async getInvoices(tenantId: string, options: {
//     page: number;
//     limit: number;
//     search?: string;
//     status?: InvoiceStatus;
//     type?: InvoiceType;
//     customerId?: string;
//     startDate?: Date;
//     endDate?: Date;
//   }): Promise<PaginatedResponse<Invoice>> {
//     // try {

//         const cacheKey = `invoices:${tenantId}:${JSON.stringify(options)}`;
    
//     return await this.cacheService.getOrSet(cacheKey, async () => {

//       const { page, limit, search, status, type, customerId, startDate, endDate } = options;
//       const skip = (page - 1) * limit;

//       let whereConditions: any = { tenantId, deletedAt: IsNull() };

//       if (status) {
//         whereConditions.status = status;
//       }

//       if (type) {
//         whereConditions.type = type;
//       }

//       if (customerId) {
//         whereConditions.customerId = customerId;
//       }

//       if (startDate && endDate) {
//         whereConditions.issueDate = Between(startDate, endDate);
//       } else if (startDate) {
//         whereConditions.issueDate = MoreThanOrEqual(startDate);
//       } else if (endDate) {
//         whereConditions.issueDate = LessThanOrEqual(endDate);
//       }

//       if (search) {
//         whereConditions = [
//           { ...whereConditions, invoiceNumber: ILike(`%${search}%`) },
//           { ...whereConditions, 'customer.name': ILike(`%${search}%`) }
//         ];
//       }

//       const [invoices, total] = await this.invoiceRepository.findAndCount({
//         where: whereConditions,
//         relations: ['customer'],
//         skip,
//         take: limit,
//         order: { createdAt: 'DESC' },
//         cache: 30000 // TypeORM cache fo
//       });

//       return {
//         data: invoices,
//         pagination: {
//           page,
//           limit,
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       };
//         }, 60); // Cache for 1 minute
//     // } catch (error) {
//     //   logger.error('Error fetching invoices:', error);
//     //   throw error;
//     // }
//   }

//   async updateInvoiceStatus(tenantId: string, invoiceId: string, status: InvoiceStatus): Promise<Invoice> {
//     try {
//       const invoice = await this.getInvoice(tenantId, invoiceId);

//       if (status === InvoiceStatus.SENT) {
//         invoice.sentAt = new Date();
//       } else if (status === InvoiceStatus.VIEWED) {
//         invoice.viewedAt = new Date();
//       } else if (status === InvoiceStatus.PAID && invoice.balanceDue === 0) {
//         invoice.paidDate = new Date();
//       }

//       invoice.status = status;
//       return await this.invoiceRepository.save(invoice);
//     } catch (error) {
//       logger.error('Error updating invoice status:', error);
//       throw error;
//     }
//   }

// async addPayment(tenantId: string, paymentData: Partial<PaymentInvoice>): Promise<PaymentInvoice> {
//   if (!paymentData.invoiceId) throw new Error('invoiceId is required');
//   if (paymentData.amount === undefined) throw new Error('amount is required');

//   const queryRunner = AppDataSource.createQueryRunner();
//   await queryRunner.connect();
//   await queryRunner.startTransaction();

//   try {
//     const invoice = await this.getInvoice(tenantId, paymentData.invoiceId);
//     const customer = await this.customerRepository.findOne({
//       where: { id: invoice.customerId, tenantId }
//     });

//     if (!customer) throw new Error('Customer not found');
//     if (paymentData.amount > invoice.balanceDue) throw new Error('Payment amount exceeds invoice balance');

//     const payment = this.paymentRepository.create({
//       ...paymentData,
//       customerId: invoice.customerId,
//       status: PaymentStatus.COMPLETED,
//       tenantId
//     });

//     const savedPayment = await queryRunner.manager.save(payment);

//     invoice.amountPaid += paymentData.amount;
//     invoice.balanceDue -= paymentData.amount;

//     if (invoice.balanceDue === 0) {
//       invoice.status = InvoiceStatus.PAID;
//       invoice.paidDate = new Date();
//     } else if (invoice.amountPaid > 0) {
//       invoice.status = InvoiceStatus.PARTIAL;
//     }

//     await queryRunner.manager.save(invoice);

//     customer.creditBalance = Math.max(0, customer.creditBalance - paymentData.amount);
//     await queryRunner.manager.save(customer);

//     await queryRunner.commitTransaction();

//     return await this.paymentRepository.findOneOrFail({
//       where: { id: savedPayment.id },
//       relations: ['invoice', 'customer']
//     });
//   } catch (error) {
//     await queryRunner.rollbackTransaction();
//     logger.error('Error adding payment:', error);
//     throw error;
//   } finally {
//     await queryRunner.release();
//   }
// }


//   async deleteInvoice(tenantId: string, invoiceId: string): Promise<void> {
//     const queryRunner = AppDataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       const invoice = await this.getInvoice(tenantId, invoiceId);

//       if (invoice.status !== InvoiceStatus.DRAFT) {
//         throw new Error('Only draft invoices can be deleted');
//       }

//       // Soft delete invoice
//       invoice.deletedAt = new Date();
//       await queryRunner.manager.save(invoice);

//       // Update customer credit balance
//       const customer = await this.customerRepository.findOne({
//         where: { id: invoice.customerId, tenantId }
//       });

//       if (customer) {
//         customer.creditBalance = Math.max(0, Number(customer.creditBalance) - invoice.totalAmount);
//         await queryRunner.manager.save(customer);
//       }

//       await queryRunner.commitTransaction();
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       logger.error('Error deleting invoice:', error);
//       throw error;
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async getCustomerInvoices(tenantId: string, customerId: string): Promise<Invoice[]> {
//     try {
//       const invoices = await this.invoiceRepository.find({
//         where: { tenantId, customerId, deletedAt: IsNull() },
//         relations: ['items'],
//         order: { createdAt: 'DESC' }
//       });

//       return invoices;
//     } catch (error) {
//       logger.error('Error fetching customer invoices:', error);
//       throw error;
//     }
//   }

//   async getOverdueInvoices(tenantId: string): Promise<Invoice[]> {
//     try {
//       const today = new Date();
//       const invoices = await this.invoiceRepository.find({
//         where: {
//           tenantId,
//           status: In([InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.PARTIAL]),
//           dueDate: LessThanOrEqual(today),
//           balanceDue: MoreThanOrEqual(0.01),
//           deletedAt: IsNull()
//         },
//         relations: ['customer'],
//         order: { dueDate: 'ASC' }
//       });

//       return invoices;
//     } catch (error) {
//       logger.error('Error fetching overdue invoices:', error);
//       throw error;
//     }
//   }

//   async getInvoiceSummary(tenantId: string): Promise<any> {
//     try {
//       const summary = await this.invoiceRepository
//         .createQueryBuilder('invoice')
//         .select('invoice.status', 'status')
//         .addSelect('COUNT(invoice.id)', 'count')
//         .addSelect('SUM(invoice.totalAmount)', 'totalAmount')
//         .addSelect('SUM(invoice.balanceDue)', 'totalBalanceDue')
//         .where('invoice.tenantId = :tenantId', { tenantId })
//         .andWhere('invoice.deletedAt IS NULL')
//         .groupBy('invoice.status')
//         .getRawMany();

//       return summary;
//     } catch (error) {
//       logger.error('Error fetching invoice summary:', error);
//       throw error;
//     }
//   }

//   async sendInvoice(tenantId: string, invoiceId: string): Promise<Invoice> {
//     try {
//       const invoice = await this.getInvoice(tenantId, invoiceId);
      
//       if (invoice.status !== InvoiceStatus.DRAFT) {
//         throw new Error('Only draft invoices can be sent');
//       }

//       invoice.status = InvoiceStatus.SENT;
//       invoice.sentAt = new Date();
      
//       return await this.invoiceRepository.save(invoice);
//     } catch (error) {
//       logger.error('Error sending invoice:', error);
//       throw error;
//     }
//   }

//   // ===== SALES REPORT =====
// async getSalesReport(
//   tenantId: string,
//   { startDate, endDate }: { startDate?: string; endDate?: string }
// ) {
//   //console.log("hi sales report service"); 
//   const query = this.invoiceRepository
//     .createQueryBuilder("invoice")
//     .leftJoinAndSelect("invoice.customer", "customer")
//     .where("invoice.tenantId = :tenantId", { tenantId });

//   if (startDate) {
//     query.andWhere("invoice.issueDate >= :startDate", { startDate });
//   }
//   if (endDate) {
//     query.andWhere("invoice.issueDate <= :endDate", { endDate });
//   }

//   query.andWhere("invoice.status IN (:...statuses)", {
//     statuses: ["paid", "partial", "sent", "open"], // only valid sales
//   });

//   const invoices = await query.getMany();
//   //console.log(invoices);

//   return {
//     totalInvoices: invoices.length,
//     totalSales: invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0),
//     totalTax: invoices.reduce((sum, inv) => sum + Number(inv.taxTotal), 0),
//     totalDiscount: invoices.reduce((sum, inv) => sum + Number(inv.discountTotal), 0),
//     data: invoices.map(inv => ({
//       invoiceNumber: inv.invoiceNumber,
//       customerName: inv.customer?.name || "",
//       issueDate: inv.issueDate,
//       totalAmount: inv.totalAmount,
//       taxTotal: inv.taxTotal,
//       discountTotal: inv.discountTotal,
//       status: inv.status,
//     })),
//   };
// }

// // ===== GSTR-1 REPORT =====
// // async getGSTR1Report(
// //   tenantId: string,
// //   { startDate, endDate }: { startDate?: string; endDate?: string }
// // ) {
// //   const query = this.invoiceRepository
// //     .createQueryBuilder("invoice")
// //     .leftJoinAndSelect("invoice.customer", "customer")
// //     .leftJoinAndSelect("invoice.gstin", "gstin")
// //     .where("invoice.tenantId = :tenantId", { tenantId });

// //   if (startDate) {
// //     query.andWhere("invoice.issueDate >= :startDate", { startDate });
// //   }
// //   if (endDate) {
// //     query.andWhere("invoice.issueDate <= :endDate", { endDate });
// //   }

// //   query.andWhere("invoice.status IN (:...statuses)", {
// //     statuses: ["paid", "partial", "sent", "open"], // outward supplies only
// //   });

// //   const invoices = await query.getMany();
// //   //console.log("invoices",invoices); 

// //   // Classify invoices into B2B / B2C / Export
// //   const reportData = invoices.map(inv => {
// //     const isB2B = inv.customer?.gstin ? true : false;
// //     return {
// //       invoiceNumber: inv.invoiceNumber,
// //       issueDate: inv.issueDate,
// //       customerName: inv.customer?.name || "",
// //       customerGSTIN: inv.customer?.gstin || "",
// //       gstinUsed: inv.gstin?.gstin || "",
// //       totalAmount: inv.totalAmount,
// //       taxDetails: inv.taxDetails || [],
// //       category: isB2B ? "B2B" : "B2C",
// //     };
// //   });

// //   return {
// //     totalInvoices: invoices.length,
// //     totalTax: invoices.reduce((sum, inv) => sum + Number(inv.taxTotal), 0),
// //     totalAmount: invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0),
// //     data: reportData,
// //   };
// // }

// async getGSTR1Report(
//   tenantId: string,
//   { startDate, endDate }: { startDate?: string; endDate?: string }
// ) {
//   const query = this.invoiceRepository
//     .createQueryBuilder("invoice")
//     .leftJoinAndSelect("invoice.customer", "customer")
//     .leftJoinAndSelect("invoice.gstin", "gstin")
//     .where("invoice.tenantId = :tenantId", { tenantId });

//   if (startDate) {
//     query.andWhere("invoice.issueDate >= :startDate", { startDate });
//   }
//   if (endDate) {
//     query.andWhere("invoice.issueDate <= :endDate", { endDate });
//   }

//   query.andWhere("invoice.status IN (:...statuses)", {
//     statuses: ["paid", "partial", "sent", "open"],
//   });

//   const invoices = await query.getMany();

//   // Classify invoices into B2B / B2C
//   const b2bInvoices = invoices
//     .filter(inv => inv.customer?.gstin) // only B2B
//     .map(inv => ({
//       invoiceNumber: inv.invoiceNumber,
//       issueDate: inv.issueDate,
//       customerName: inv.customer?.name || "",
//       customerGSTIN: inv.customer?.gstin || "",
//       gstinUsed: inv.gstin?.gstin || "",
//       taxableValue: Number(inv.subTotal) - Number(inv.discountTotal),
//       taxAmount: Number(inv.taxTotal),
//       totalAmount: Number(inv.totalAmount),
//       taxDetails: inv.taxDetails || [],
//     }));

//   // Summary
//   const summary = {
//     totalInvoices: invoices.length,
//     totalTaxableValue: invoices.reduce((sum, inv) => sum + (Number(inv.subTotal) - Number(inv.discountTotal)), 0),
//     totalTaxAmount: invoices.reduce((sum, inv) => sum + Number(inv.taxTotal), 0),
//     totalCessAmount: 0, // if you have cess field, replace with real calculation
//     b2bCount: b2bInvoices.length,
//   };

//   return {
//     summary,
//     b2bInvoices,
//     data: invoices.map(inv => ({
//       invoiceNumber: inv.invoiceNumber,
//       issueDate: inv.issueDate,
//       customerName: inv.customer?.name || "",
//       customerGSTIN: inv.customer?.gstin || "",
//       gstinUsed: inv.gstin?.gstin || "",
//       totalAmount: inv.totalAmount,
//       taxDetails: inv.taxDetails || [],
//       category: inv.customer?.gstin ? "B2B" : "B2C",
//     })),
//   };
// }

//  // install with: npm install get-stream

// // Inside InvoiceService class
// async generateInvoicePDF(invoice: Invoice, setting: Setting): Promise<Buffer> {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 50 });
//       const chunks: Buffer[] = [];

//       doc.on("data", (chunk) => chunks.push(chunk));
//       doc.on("end", () => resolve(Buffer.concat(chunks)));
//       doc.on("error", reject);

//       const toAmount = (value: any) =>
//         isNaN(Number(value)) ? "0.00" : Number(value).toFixed(2);

//       // ===== HEADER =====
//       doc.fontSize(22).text("INVOICE", { align: "center", underline: true });
//       doc.moveDown(1.5);

//       // LEFT: Company Info
//       let y = doc.y;
//       doc.fontSize(10).text(setting.companyName || "", 50, y);
//       // doc.text(setting.address || "", 50);
//       doc.text(`Phone: ${setting.contactPhone || ""}`, 50);
//       doc.text(`Email: ${setting.contactEmail || ""}`, 50);
//       doc.text(`GSTIN: ${setting.gstNumber || ""}`, 50);

//       // RIGHT: Invoice Metadata
//       const issueDate = invoice.issueDate ? new Date(invoice.issueDate) : null;
//       const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;

//       y = 100; // fixed position so it doesn’t override company block
//       doc.text(`Invoice No: ${invoice.invoiceNumber}`, 350, y);
//       if (issueDate) doc.text(`Issue Date: ${issueDate.toDateString()}`, 350);
//       if (dueDate) doc.text(`Due Date: ${dueDate.toDateString()}`, 350);

//       doc.moveDown(4);

//       // ===== BILLING INFO =====
//       doc.fontSize(12).fillColor("#333").text("Bill To:", 50, doc.y, { underline: true });
//       doc.moveDown(0.5);
//       doc.fontSize(10).fillColor("black");
//       if (invoice.customer) {
//         doc.text(invoice.customer.name || "", 50);
//         if (invoice.customer.email) doc.text(invoice.customer.email, 50);
//       }
//       if (invoice.billingAddress) doc.text(invoice.billingAddress, 50);

//       doc.moveDown(2);

//       // ===== ITEMS TABLE =====
//       doc.fontSize(12).fillColor("#333").text("Items", 50, doc.y, { underline: true });
//       doc.moveDown(0.8);

//       // Table header with fixed columns
//       doc.fontSize(10).fillColor("black");
//       const startY = doc.y;
//       doc.text("No", 50, startY);
//       doc.text("Description", 90, startY);
//       doc.text("Qty", 300, startY, { width: 50, align: "right" });
//       doc.text("Price", 380, startY, { width: 80, align: "right" });
//       doc.text("Total", 480, startY, { width: 80, align: "right" });

//       doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).stroke();

//       doc.moveDown(2);

//       // Table Rows
//       if (invoice.items?.length) {
//         invoice.items.forEach((item, i) => {
//           const rowY = doc.y;
//           doc.text(`${i + 1}`, 50, rowY);
//           doc.text(item.product?.name || item.description || "Item", 90, rowY);
//           doc.text(`${item.quantity}`, 300, rowY, { width: 50, align: "right" });
//           doc.text(toAmount(item.unitPrice), 380, rowY, { width: 80, align: "right" });
//           doc.text(toAmount(item.lineTotal), 480, rowY, { width: 80, align: "right" });
//         });
//       } else {
//         doc.text("No items found.", 50, doc.y);
//       }

//       doc.moveDown(2);

//       // ===== TOTALS =====
//       doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
//       doc.moveDown(0.5);

//       const totalsY = doc.y;
//       doc.fontSize(10);

//       doc.text("Subtotal:", 360, totalsY);
//       doc.text(toAmount(invoice.subTotal), 500, totalsY, { align: "right" });

//       doc.text("Tax:", 360, doc.y);
//       doc.text(toAmount(invoice.taxTotal), 500, doc.y, { align: "right" });

//       doc.text("Discount:", 360, doc.y);
//       doc.text(toAmount(invoice.discountTotal), 500, doc.y, { align: "right" });

//       doc.font("Helvetica-Bold").text("Total:", 360, doc.y);
//       doc.text(toAmount(invoice.totalAmount), 500, doc.y, { align: "right" });

//       doc.text("Balance Due:", 360, doc.y);
//       doc.text(toAmount(invoice.balanceDue), 500, doc.y, { align: "right" });
//       doc.font("Helvetica");

//       doc.moveDown(2);

//       // ===== FOOTER =====
//       doc.fontSize(9).fillColor("gray").text("Thank you for your business!", { align: "center" });
//       if (invoice.termsAndConditions) {
//         doc.moveDown(0.5);
//         doc.fontSize(8).fillColor("black").text(`Terms: ${invoice.termsAndConditions}`, { align: "center" });
//       }

//       // END PDF STREAM
//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// async bulkCreateInvoices(tenantId: string, invoicesData: any[]): Promise<Invoice[]> {
//   const queryRunner = AppDataSource.createQueryRunner();
//   await queryRunner.connect();
//   await queryRunner.startTransaction();

//   try {
//     const invoices = this.invoiceRepository.create(
//   invoicesData.map(data => ({ ...data, tenantId }))
// );

// const savedInvoices = await queryRunner.manager.save(invoices);
//     // Invalidate caches
//     await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);

//     await queryRunner.commitTransaction();
//     return savedInvoices;
//   } catch (error) {
//     await queryRunner.rollbackTransaction();
//     logger.error('Error bulk creating invoices:', error);
//     throw error;
//   } finally {
//     await queryRunner.release();
//   }
// }

// }





// Inside InvoiceService class
// async generateInvoicePDF(invoice: Invoice,setting:Setting): Promise<Buffer> {
//   console.log("Generating PDF for invoice in service...");
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 50 });
//       const chunks: Buffer[] = [];

//       doc.on("data", (chunk) => chunks.push(chunk));
//       doc.on("end", () => resolve(Buffer.concat(chunks)));
//       doc.on("error", reject);

//       // ===== HEADER =====
//       doc.fontSize(20).text("INVOICE", { align: "center" });
//       doc.moveDown();

//       // Company Info
//       doc.fontSize(10).text(`Company Name: ${setting.companyName || ""}`);
//       doc.text(`Address: ${setting.address || ""}`);
//       doc.text(`Phone: ${setting.contactPhone || ""}`);
//       doc.text(`Email: ${setting.contactEmail || ""}`);
//       doc.text(`GSTIN: ${setting.gstNumber || ""}`); 
//       doc.moveDown();

//       // Invoice Info
//       const issueDate = invoice.issueDate ? new Date(invoice.issueDate) : null;
//       const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;

//       doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
//       if (issueDate) doc.text(`Date: ${issueDate.toDateString()}`);
//       if (dueDate) doc.text(`Due Date: ${dueDate.toDateString()}`);
//       doc.moveDown();

//       // Customer Info
//       if (invoice.customer) {
//         doc.text(`Bill To: ${invoice.customer.name || ""}`);
//         if (invoice.customer.email) doc.text(invoice.customer.email);
//       }
//       if (invoice.billingAddress) doc.text(invoice.billingAddress);
//       doc.moveDown();

//       // ===== ITEMS =====
//       doc.fontSize(12).text("Items:");
//       doc.moveDown(0.5);

//       if (invoice.items?.length) {
//         invoice.items.forEach((item, i) => {
//           doc.text(
//             `${i + 1}. ${item.product?.name || item.description || "Item"} | Qty: ${
//               item.quantity
//             } | Price: ${item.unitPrice} | Total: ${item.lineTotal}`
//           );
//         });
//       } else {
//         doc.text("No items.");
//       }

//       doc.moveDown();

//       // ===== TOTALS =====
//       doc.fontSize(12).text(`Subtotal: ${invoice.subTotal || 0}`);
//       doc.text(`Tax: ${invoice.taxTotal || 0}`);
//       doc.text(`Discount: ${invoice.discountTotal || 0}`);
//       doc.text(`Total: ${invoice.totalAmount || 0}`, { underline: true });
//       doc.text(`Balance Due: ${invoice.balanceDue || 0}`);
//       doc.moveDown();

//       // END PDF STREAM
//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// }



