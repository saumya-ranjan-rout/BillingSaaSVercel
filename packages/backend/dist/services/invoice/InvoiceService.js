"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Invoice_1 = require("../../entities/Invoice");
const InvoiceItem_1 = require("../../entities/InvoiceItem");
const PaymentInvoice_1 = require("../../entities/PaymentInvoice");
const Customer_1 = require("../../entities/Customer");
const Product_1 = require("../../entities/Product");
const logger_1 = __importDefault(require("../../utils/logger"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const LoyaltyService_1 = require("../loyalty/LoyaltyService");
const CacheService_1 = require("../cache/CacheService");
const TaxDetail_1 = require("../../entities/TaxDetail");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class InvoiceService {
    constructor() {
        this.invoiceRepository = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
        this.invoiceItemRepository = database_1.AppDataSource.getRepository(InvoiceItem_1.InvoiceItem);
        this.paymentRepository = database_1.AppDataSource.getRepository(PaymentInvoice_1.PaymentInvoice);
        this.customerRepository = database_1.AppDataSource.getRepository(Customer_1.Customer);
        this.productRepository = database_1.AppDataSource.getRepository(Product_1.Product);
        this.taxDetailRepository = database_1.AppDataSource.getRepository(TaxDetail_1.TaxDetail);
        this.loyaltyService = new LoyaltyService_1.LoyaltyService();
        this.cacheService = new CacheService_1.CacheService();
    }
    async getInvoicesWithKeysetPagination(tenantId, options) {
        const { cursor, limit = 20, search, status, customerId, startDate, endDate, } = options;
        const take = Math.min(limit, 100);
        const queryBuilder = this.invoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.customer', 'customer')
            .where('invoice.tenantId = :tenantId', { tenantId })
            .andWhere('invoice.deletedAt IS NULL')
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
        if (cursor) {
            const [cursorDate, cursorId] = cursor.split('_');
            queryBuilder.andWhere('(invoice.createdAt < :cursorDate OR (invoice.createdAt = :cursorDate AND invoice.id < :cursorId))', { cursorDate: new Date(cursorDate), cursorId });
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
    async getInvoiceWithDetails(tenantId, invoiceId) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
            relations: [
                'customer',
                'items',
                'items.product',
                'payments',
                'taxDetails',
                'gstin'
            ],
        });
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return invoice;
    }
    async getInvoicesForListView(tenantId, options) {
        const { page = 1, limit = 20, search, status, customerId } = options;
        const skip = (page - 1) * limit;
        const queryBuilder = this.invoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.customer', 'customer')
            .where('invoice.tenantId = :tenantId', { tenantId })
            .andWhere('invoice.deletedAt IS NULL')
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
    safeNumber(value, defaultValue = 0) {
        if (value === null || value === undefined || value === '') {
            return defaultValue;
        }
        const num = Number(value);
        return Number.isFinite(num) ? num : defaultValue;
    }
    roundToTwoDecimals(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
    generateInvoiceNumber(tenantId) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `INV-${tenantId.slice(-4)}-${timestamp}-${random}`;
    }
    calculateDueDate(issueDate, paymentTerms) {
        const dueDate = new Date(issueDate);
        switch (paymentTerms) {
            case Invoice_1.PaymentTerms.DUE_ON_RECEIPT:
                dueDate.setDate(dueDate.getDate());
                break;
            case Invoice_1.PaymentTerms.NET_7:
                dueDate.setDate(dueDate.getDate() + 7);
                break;
            case Invoice_1.PaymentTerms.NET_15:
                dueDate.setDate(dueDate.getDate() + 15);
                break;
            case Invoice_1.PaymentTerms.NET_30:
                dueDate.setDate(dueDate.getDate() + 30);
                break;
            case Invoice_1.PaymentTerms.NET_60:
                dueDate.setDate(dueDate.getDate() + 60);
                break;
            default:
                dueDate.setDate(dueDate.getDate() + 15);
        }
        return dueDate;
    }
    calculateItemTotals(item) {
        const quantity = this.safeNumber(item.quantity, 0);
        const unitPrice = this.safeNumber(item.unitPrice, 0);
        const discount = this.safeNumber(item.discount, 0);
        const taxRate = this.safeNumber(item.taxRate, 0);
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
    async safeProcessLoyalty(invoiceId) {
        try {
            setTimeout(async () => {
                try {
                    await this.loyaltyService.processInvoiceForLoyalty(invoiceId);
                    logger_1.default.info(`Loyalty processing completed for invoice: ${invoiceId}`);
                }
                catch (loyaltyError) {
                    logger_1.default.error('Loyalty processing failed (non-critical):', loyaltyError);
                }
            }, 2000);
        }
        catch (error) {
            logger_1.default.error('Error scheduling loyalty processing:', error);
        }
    }
    async createInvoice(tenantId, invoiceData) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const customer = await this.customerRepository.findOne({
                where: { id: invoiceData.customerId, tenantId }
            });
            if (!customer) {
                throw new Error('Customer not found');
            }
            const invoiceNumber = this.generateInvoiceNumber(tenantId);
            const dueDate = this.calculateDueDate(new Date(invoiceData.issueDate), invoiceData.paymentTerms);
            let subTotal = 0;
            let taxTotal = 0;
            let discountTotal = 0;
            const taxDetails = [];
            const discountDetails = [];
            const productIds = Array.from(new Set((invoiceData.items || [])
                .map((it) => it.productId)
                .filter(Boolean)));
            let productsMap = {};
            if (productIds.length) {
                const products = await this.productRepository.find({
                    where: { id: (0, typeorm_1.In)(productIds), tenantId }
                });
                productsMap = products.reduce((acc, p) => {
                    acc[p.id] = p;
                    return acc;
                }, {});
            }
            const items = await Promise.all((invoiceData.items || []).map(async (itemData) => {
                itemData.quantity = this.safeNumber(itemData.quantity, 0);
                itemData.unitPrice = this.safeNumber(itemData.unitPrice, 0);
                itemData.discount = this.safeNumber(itemData.discount, 0);
                itemData.taxRate = this.safeNumber(itemData.taxRate, 0);
                const itemTotals = this.calculateItemTotals(itemData);
                subTotal += itemData.unitPrice * itemData.quantity;
                discountTotal += itemTotals.discountAmount;
                taxTotal += itemTotals.taxAmount;
                const existingTax = taxDetails.find(t => t.taxRate === itemData.taxRate);
                if (existingTax) {
                    existingTax.taxAmount += itemTotals.taxAmount;
                    existingTax.taxableValue += itemTotals.taxableAmount;
                }
                else {
                    taxDetails.push({
                        taxName: `Tax ${itemData.taxRate || 0}%`,
                        taxRate: itemData.taxRate || 0,
                        taxAmount: itemTotals.taxAmount,
                        taxableValue: itemTotals.taxableAmount
                    });
                }
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
                if (itemData.productId) {
                    const product = productsMap[itemData.productId];
                    if (product && product.type === Product_1.ProductType.GOODS) {
                        if (product.stockQuantity < itemData.quantity) {
                            throw new Error(`Insufficient stock for product: ${product.name}`);
                        }
                        product.stockQuantity = Number(product.stockQuantity) - Number(itemData.quantity);
                        await queryRunner.manager.save(product);
                    }
                }
                return invoiceItem;
            }));
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
            if (invoiceData.cashBack > 0) {
                await this.loyaltyService.redeemCashback(tenantId, invoiceData.customerId, invoiceData.cashBack);
            }
            customer.creditBalance = this.roundToTwoDecimals(Number(customer.creditBalance) + totalAmount);
            await queryRunner.manager.save(customer);
            await Promise.all([
                this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
                this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
                this.cacheService.invalidatePattern(`dashboard:${tenantId}`)
            ]);
            await queryRunner.commitTransaction();
            this.safeProcessLoyalty(savedInvoice.id);
            return savedInvoice;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error creating invoice:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateInvoice(tenantId, invoiceId, invoiceData) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const invoice = await this.getInvoice(tenantId, invoiceId);
            if (![Invoice_1.InvoiceStatus.DRAFT, Invoice_1.InvoiceStatus.PARTIAL].includes(invoice.status)) {
                throw new Error('Only draft or partial invoices can be updated');
            }
            const customer = await this.customerRepository.findOne({
                where: { id: invoiceData.customerId, tenantId }
            });
            if (!customer)
                throw new Error('Customer not found');
            const oldProductIds = (invoice.items || []).map(it => it.productId).filter(Boolean);
            const newProductIds = (invoiceData.items || []).map((it) => it.productId).filter(Boolean);
            const allProductIds = Array.from(new Set([...oldProductIds, ...newProductIds]));
            let productsMap = {};
            if (allProductIds.length) {
                const products = await this.productRepository.find({
                    where: { id: (0, typeorm_1.In)(allProductIds), tenantId }
                });
                productsMap = products.reduce((acc, p) => {
                    acc[p.id] = p;
                    return acc;
                }, {});
            }
            for (const oldItem of invoice.items) {
                if (oldItem.productId) {
                    const product = productsMap[oldItem.productId];
                    if (product && product.type === Product_1.ProductType.GOODS) {
                        product.stockQuantity += this.safeNumber(oldItem.quantity);
                        await queryRunner.manager.save(product);
                    }
                }
            }
            await queryRunner.manager.remove(InvoiceItem_1.InvoiceItem, invoice.items || []);
            await queryRunner.manager.remove(TaxDetail_1.TaxDetail, invoice.taxDetails || []);
            let subTotal = 0;
            let taxTotal = 0;
            let discountTotal = 0;
            const taxDetailsData = [];
            const discountDetails = [];
            const newItems = await Promise.all((invoiceData.items || []).map(async (itemData) => {
                itemData.quantity = this.safeNumber(itemData.quantity, 0);
                itemData.unitPrice = this.safeNumber(itemData.unitPrice, 0);
                itemData.discount = this.safeNumber(itemData.discount, 0);
                itemData.taxRate = this.safeNumber(itemData.taxRate, 0);
                const itemTotals = this.calculateItemTotals(itemData);
                const discountAmount = this.safeNumber(itemTotals.discountAmount);
                const taxAmount = this.safeNumber(itemTotals.taxAmount);
                const taxableAmount = this.safeNumber(itemTotals.taxableAmount);
                subTotal += itemData.unitPrice * itemData.quantity;
                discountTotal += discountAmount;
                taxTotal += taxAmount;
                const existingTax = taxDetailsData.find(t => t.taxRate === itemData.taxRate);
                if (existingTax) {
                    existingTax.taxAmount += taxAmount;
                    existingTax.taxableValue += taxableAmount;
                }
                else {
                    taxDetailsData.push({
                        taxName: `Tax ${itemData.taxRate}%`,
                        taxRate: itemData.taxRate,
                        taxAmount,
                        taxableValue: taxableAmount
                    });
                }
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
                if (itemData.productId) {
                    const product = productsMap[itemData.productId];
                    if (product && product.type === Product_1.ProductType.GOODS) {
                        if (product.stockQuantity < itemData.quantity) {
                            throw new Error(`Insufficient stock for product: ${product.name}`);
                        }
                        product.stockQuantity -= itemData.quantity;
                        await queryRunner.manager.save(product);
                    }
                }
                return invoiceItem;
            }));
            subTotal = this.roundToTwoDecimals(subTotal);
            discountTotal = this.roundToTwoDecimals(discountTotal);
            taxTotal = this.roundToTwoDecimals(taxTotal);
            const totalAmount = this.roundToTwoDecimals(subTotal - discountTotal + taxTotal);
            const amountPaid = this.safeNumber(invoice.amountPaid);
            const creditAdjustment = totalAmount - this.safeNumber(invoice.totalAmount);
            customer.creditBalance = this.roundToTwoDecimals(Number(customer.creditBalance) + creditAdjustment);
            await queryRunner.manager.save(customer);
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
            invoice.balanceDue = this.roundToTwoDecimals(totalAmount - amountPaid - invoiceData.cashBack);
            invoice.discountDetails = discountDetails;
            invoice.items = newItems;
            const savedInvoice = await queryRunner.manager.save(invoice);
            if (invoiceData.cashBack > 0) {
                await this.loyaltyService.redeemCashback(tenantId, invoiceData.customerId, invoiceData.cashBack);
            }
            const taxDetailEntities = this.taxDetailRepository.create(taxDetailsData.map(td => ({
                ...td,
                tenantId,
                invoice: savedInvoice
            })));
            await queryRunner.manager.save(taxDetailEntities);
            savedInvoice.taxDetails = taxDetailEntities;
            await Promise.all([
                this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
                this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
                this.cacheService.invalidatePattern(`dashboard:${tenantId}`)
            ]);
            await queryRunner.commitTransaction();
            this.safeProcessLoyalty(savedInvoice.id);
            return savedInvoice;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error updating invoice:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getInvoice(tenantId, invoiceId) {
        try {
            const invoice = await this.invoiceRepository.findOne({
                where: { id: invoiceId, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['customer', 'items', 'items.product', 'payments', 'taxDetails']
            });
            if (!invoice) {
                throw new Error('Invoice not found');
            }
            return invoice;
        }
        catch (error) {
            logger_1.default.error('Error fetching invoice:', error);
            throw error;
        }
    }
    async getInvoices(tenantId, options) {
        const cacheKey = `invoices:${tenantId}:${JSON.stringify(options)}`;
        return await this.cacheService.getOrSet(cacheKey, async () => {
            const { page, limit, search, status, type, customerId, startDate, endDate } = options;
            const skip = (page - 1) * limit;
            let whereConditions = { tenantId, deletedAt: (0, typeorm_1.IsNull)() };
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
                whereConditions.issueDate = (0, typeorm_1.Between)(startDate, endDate);
            }
            else if (startDate) {
                whereConditions.issueDate = (0, typeorm_1.MoreThanOrEqual)(startDate);
            }
            else if (endDate) {
                whereConditions.issueDate = (0, typeorm_1.LessThanOrEqual)(endDate);
            }
            if (search) {
                whereConditions = [
                    { ...whereConditions, invoiceNumber: (0, typeorm_1.ILike)(`%${search}%`) },
                    { ...whereConditions, 'customer.name': (0, typeorm_1.ILike)(`%${search}%`) }
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
    async updateInvoiceStatus(tenantId, invoiceId, status) {
        try {
            const invoice = await this.getInvoice(tenantId, invoiceId);
            if (status === Invoice_1.InvoiceStatus.SENT) {
                invoice.sentAt = new Date();
            }
            else if (status === Invoice_1.InvoiceStatus.VIEWED) {
                invoice.viewedAt = new Date();
            }
            else if (status === Invoice_1.InvoiceStatus.PAID && invoice.balanceDue === 0) {
                invoice.paidDate = new Date();
            }
            invoice.status = status;
            return await this.invoiceRepository.save(invoice);
        }
        catch (error) {
            logger_1.default.error('Error updating invoice status:', error);
            throw error;
        }
    }
    async addPayment(tenantId, paymentData) {
        if (!paymentData.invoiceId)
            throw new Error('invoiceId is required');
        if (paymentData.amount === undefined)
            throw new Error('amount is required');
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const invoice = await this.getInvoice(tenantId, paymentData.invoiceId);
            const customer = await this.customerRepository.findOne({
                where: { id: invoice.customerId, tenantId }
            });
            if (!customer)
                throw new Error('Customer not found');
            const paymentAmount = this.safeNumber(paymentData.amount);
            if (paymentAmount > invoice.balanceDue) {
                throw new Error('Payment amount exceeds invoice balance');
            }
            const payment = this.paymentRepository.create({
                ...paymentData,
                amount: paymentAmount,
                customerId: invoice.customerId,
                status: PaymentInvoice_1.PaymentStatus.COMPLETED,
                tenantId
            });
            const savedPayment = await queryRunner.manager.save(payment);
            invoice.amountPaid = this.roundToTwoDecimals(Number(invoice.amountPaid) + paymentAmount);
            invoice.balanceDue = this.roundToTwoDecimals(Number(invoice.balanceDue) - paymentAmount);
            if (invoice.balanceDue === 0) {
                invoice.status = Invoice_1.InvoiceStatus.PAID;
                invoice.paidDate = new Date();
            }
            else if (invoice.amountPaid > 0) {
                invoice.status = Invoice_1.InvoiceStatus.PARTIAL;
            }
            await queryRunner.manager.save(invoice);
            customer.creditBalance = Math.max(0, this.roundToTwoDecimals(Number(customer.creditBalance) - paymentAmount));
            await queryRunner.manager.save(customer);
            await queryRunner.commitTransaction();
            return await this.paymentRepository.findOneOrFail({
                where: { id: savedPayment.id },
                relations: ['invoice', 'customer']
            });
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error adding payment:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteInvoice(tenantId, invoiceId) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const invoice = await this.getInvoice(tenantId, invoiceId);
            if (invoice.status !== Invoice_1.InvoiceStatus.DRAFT) {
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
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error deleting invoice:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getOrCreateCustomerByEmail(tenantId, name, email) {
        if (email) {
            const existingByEmail = await this.customerRepository.findOne({
                where: { email, tenant: { id: tenantId } },
            });
            if (existingByEmail)
                return existingByEmail;
        }
        const newCustomer = this.customerRepository.create({
            tenant: { id: tenantId },
            name: name || 'Unknown Customer',
            email: email || undefined,
        });
        await this.customerRepository.save(newCustomer);
        return newCustomer;
    }
    async getCustomerInvoices(tenantId, customerId) {
        try {
            const invoices = await this.invoiceRepository.find({
                where: { tenantId, customerId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['items'],
                order: { createdAt: 'DESC' }
            });
            return invoices;
        }
        catch (error) {
            logger_1.default.error('Error fetching customer invoices:', error);
            throw error;
        }
    }
    async getOverdueInvoices(tenantId) {
        try {
            const today = new Date();
            const invoices = await this.invoiceRepository.find({
                where: {
                    tenantId,
                    status: (0, typeorm_1.In)([Invoice_1.InvoiceStatus.SENT, Invoice_1.InvoiceStatus.VIEWED, Invoice_1.InvoiceStatus.PARTIAL]),
                    dueDate: (0, typeorm_1.LessThanOrEqual)(today),
                    balanceDue: (0, typeorm_1.MoreThanOrEqual)(0.01),
                    deletedAt: (0, typeorm_1.IsNull)()
                },
                relations: ['customer'],
                order: { dueDate: 'ASC' }
            });
            return invoices;
        }
        catch (error) {
            logger_1.default.error('Error fetching overdue invoices:', error);
            throw error;
        }
    }
    async getInvoiceSummary(tenantId) {
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
        }
        catch (error) {
            logger_1.default.error('Error fetching invoice summary:', error);
            throw error;
        }
    }
    async sendInvoice(tenantId, invoiceId) {
        try {
            const invoice = await this.getInvoice(tenantId, invoiceId);
            if (invoice.status !== Invoice_1.InvoiceStatus.DRAFT) {
                throw new Error('Only draft invoices can be sent');
            }
            invoice.status = Invoice_1.InvoiceStatus.SENT;
            invoice.sentAt = new Date();
            return await this.invoiceRepository.save(invoice);
        }
        catch (error) {
            logger_1.default.error('Error sending invoice:', error);
            throw error;
        }
    }
    async getSalesReport(tenantId, { startDate, endDate }) {
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
    async getGSTR1Report(tenantId, { startDate, endDate }) {
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
    async generateInvoicePDF(invoice, setting) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const watermarkPath = path_1.default.resolve(__dirname, "../../../public/logo.png");
                if (fs_1.default.existsSync(watermarkPath)) {
                    const { width, height } = doc.page;
                    doc.save();
                    doc.opacity(0.10);
                    doc.image(watermarkPath, width / 2 - 150, height / 2 - 150, {
                        width: 300,
                        align: "center",
                        valign: "center",
                    });
                    doc.restore();
                }
                const chunks = [];
                doc.on("data", (chunk) => chunks.push(chunk));
                doc.on("end", () => resolve(Buffer.concat(chunks)));
                doc.on("error", reject);
                const toAmount = (value) => isNaN(Number(value)) ? "0.00" : Number(value).toFixed(2);
                const logoPath = path_1.default.resolve(__dirname, "../../../public/logo.png");
                if (fs_1.default.existsSync(logoPath)) {
                    doc.image(logoPath, 50, 45, { width: 100 });
                }
                doc.fontSize(24)
                    .font("Helvetica-Bold")
                    .text("INVOICE", { align: "center", underline: true });
                doc.moveDown(1.5);
                let y = doc.y;
                doc.fontSize(10).text(setting.companyName || "", 50, y);
                doc.text(`Phone: ${setting.contactPhone || ""}`, 50);
                doc.text(`Email: ${setting.contactEmail || ""}`, 50);
                doc.text(`GSTIN: ${setting.gstNumber || ""}`, 50);
                const issueDate = invoice.issueDate ? new Date(invoice.issueDate) : null;
                const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;
                y = 100;
                doc.text(`Invoice No: ${invoice.invoiceNumber}`, 350, y);
                if (issueDate)
                    doc.text(`Issue Date: ${issueDate.toDateString()}`, 350);
                if (dueDate)
                    doc.text(`Due Date: ${dueDate.toDateString()}`, 350);
                doc.moveDown(4);
                doc.fontSize(12).fillColor("#333").text("Bill To:", 50, doc.y, { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(10).fillColor("black");
                if (invoice.customer) {
                    doc.text(invoice.customer.name || "", 50);
                    if (invoice.customer.email)
                        doc.text(invoice.customer.email, 50);
                }
                if (invoice.billingAddress)
                    doc.text(invoice.billingAddress, 50);
                doc.moveDown(2);
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
                }
                else {
                    doc.text("No items found.", 50, doc.y);
                }
                doc.moveDown(2);
                doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
                doc.moveDown(1);
                const lineGap = 15;
                let ty = doc.y;
                const addLine = (label, value, bold = false) => {
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
                doc.moveDown(2);
                doc.text("", 50);
                doc.fontSize(9).fillColor("gray").text("Thank you for your business!", { align: "center" });
                if (invoice.termsAndConditions) {
                    doc.moveDown(0.5);
                    doc.fontSize(8).fillColor("black").text(`Terms: ${invoice.termsAndConditions}`, { align: "center" });
                }
                doc.end();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async bulkCreateInvoices(tenantId, invoicesData) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const invoices = this.invoiceRepository.create(invoicesData.map(data => ({ ...data, tenantId })));
            const savedInvoices = await queryRunner.manager.save(invoices);
            await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);
            await queryRunner.commitTransaction();
            return savedInvoices;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error bulk creating invoices:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=InvoiceService.js.map