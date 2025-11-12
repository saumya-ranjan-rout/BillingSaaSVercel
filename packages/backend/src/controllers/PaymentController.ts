import { Request, Response } from 'express';
import { Between, IsNull } from 'typeorm';
import { AppDataSource } from '../../config/database-optimized';
import { Payment } from '../../entities/Payment';
import { Invoice } from '../../entities/Invoice';
import { CacheService } from '../../services/cache/CacheService';
import { logger } from '../../utils/logger-optimized';
import { ok, errorResponse } from '../../utils/response-optimized';

export class OptimizedPaymentController {
  private static paymentRepository = AppDataSource.getRepository(Payment);
  private static invoiceRepository = AppDataSource.getRepository(Invoice);
  private static cacheService = new CacheService();

  static async list(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { 
        page = 1, 
        limit = 20, 
        invoiceId,
        customerId,
        startDate,
        endDate 
      } = req.query;

      const cacheKey = `payments:${tenantId}:${page}:${limit}:${invoiceId}:${customerId}:${startDate}:${endDate}`;
      
      const payments = await this.cacheService.getOrSet(cacheKey, async () => {
        const skip = (Number(page) - 1) * Number(limit);
        const where: any = { tenantId, deletedAt: IsNull() };

        if (invoiceId) {
          where.invoiceId = invoiceId;
        }

        if (customerId) {
          where.customerId = customerId;
        }

        if (startDate && endDate) {
          where.paymentDate = Between(new Date(startDate as string), new Date(endDate as string));
        }

        const [data, total] = await this.paymentRepository.findAndCount({
          where,
          relations: ['invoice', 'customer'],
          order: { paymentDate: 'DESC' },
          skip,
          take: Number(limit),
        });

        return {
          data,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        };
      }, 300);

      return ok(res, payments);
    } catch (error) {
      logger.error('Error fetching payments:', error);
      return errorResponse(res, 'Failed to fetch payments');
    }
  }

  static async create(req: Request, res: Response) {
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const tenantId = (req as any).tenantId;
      const { invoiceId, amount, ...paymentData } = req.body;

      // Verify invoice exists and belongs to tenant
      const invoice = await this.invoiceRepository.findOne({
        where: { id: invoiceId, tenantId, deletedAt: IsNull() }
      });

      if (!invoice) {
        return errorResponse(res, 'Invoice not found', 404);
      }

      // Check if payment amount is valid
      if (amount <= 0) {
        return errorResponse(res, 'Payment amount must be greater than 0', 400);
      }

      if (amount > invoice.balanceDue) {
        return errorResponse(res, 'Payment amount exceeds invoice balance due', 400);
      }

      const payment = this.paymentRepository.create({
        ...paymentData,
        amount,
        invoiceId,
        customerId: invoice.customerId,
        tenantId,
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // Update invoice balance
      invoice.balanceDue -= amount;
      
      // Update invoice status if fully paid
      if (invoice.balanceDue <= 0) {
        invoice.status = 'paid';
        invoice.paidAt = new Date();
      } else if (invoice.balanceDue < invoice.totalAmount) {
        invoice.status = 'partial';
      }

      await queryRunner.manager.save(invoice);

      // Invalidate caches
      await this.cacheService.invalidatePattern(`payments:${tenantId}:*`);
      await this.cacheService.del(`invoice:${tenantId}:${invoiceId}`);
   //   await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);
      await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
      await this.cacheService.invalidatePattern(`customer:${tenantId}:${invoice.customerId}`);
      // await this.cacheService.invalidatePattern(`customers:${tenantId}:*`);
      await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/customers*`),
      await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);

      await queryRunner.commitTransaction();

      logger.info(`Payment created: ${savedPayment.id} for invoice: ${invoiceId}`);
      return ok(res, savedPayment, 201);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating payment:', error);
      return errorResponse(res, 'Failed to create payment');
    } finally {
      await queryRunner.release();
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const cacheKey = `payment:${tenantId}:${id}`;
      
      const payment = await this.cacheService.getOrSet(cacheKey, async () => {
        return await this.paymentRepository.findOne({
          where: { id, tenantId, deletedAt: IsNull() },
          relations: ['invoice', 'customer'],
        });
      }, 600);

      if (!payment) {
        return errorResponse(res, 'Payment not found', 404);
      }

      return ok(res, payment);
    } catch (error) {
      logger.error('Error fetching payment:', error);
      return errorResponse(res, 'Failed to fetch payment');
    }
  }

  static async delete(req: Request, res: Response) {
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const payment = await this.paymentRepository.findOne({
        where: { id, tenantId, deletedAt: IsNull() },
        relations: ['invoice'],
      });

      if (!payment) {
        return errorResponse(res, 'Payment not found', 404);
      }

      // Restore invoice balance
      const invoice = payment.invoice;
      invoice.balanceDue += payment.amount;
      
      // Update invoice status
      if (invoice.balanceDue === invoice.totalAmount) {
        invoice.status = 'pending';
        invoice.paidAt = null;
      } else if (invoice.balanceDue > 0) {
        invoice.status = 'partial';
      }

      // Soft delete payment
      payment.deletedAt = new Date();

      await queryRunner.manager.save(invoice);
      await queryRunner.manager.save(payment);

      // Invalidate caches
      await this.cacheService.del(`payment:${tenantId}:${id}`);
      await this.cacheService.invalidatePattern(`payments:${tenantId}:*`);
      await this.cacheService.del(`invoice:${tenantId}:${invoice.id}`);
      // await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);
      await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
      await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);

      await queryRunner.commitTransaction();

      logger.info(`Payment deleted: ${id}`);
      return ok(res, { message: 'Payment deleted successfully' });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error deleting payment:', error);
      return errorResponse(res, 'Failed to delete payment');
    } finally {
      await queryRunner.release();
    }
  }

  static async getPaymentMethodsSummary(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { startDate, endDate } = req.query;

      const cacheKey = `payments:methods:${tenantId}:${startDate}:${endDate}`;
      
      const summary = await this.cacheService.getOrSet(cacheKey, async () => {
        const query = this.paymentRepository
          .createQueryBuilder('payment')
          .select('payment.method', 'method')
          .addSelect('SUM(payment.amount)', 'totalAmount')
          .addSelect('COUNT(payment.id)', 'count')
          .where('payment.tenantId = :tenantId', { tenantId })
          .andWhere('payment.deletedAt IS NULL');

        if (startDate && endDate) {
          query.andWhere('payment.paymentDate BETWEEN :startDate AND :endDate', {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string),
          });
        }

        return await query
          .groupBy('payment.method')
          .orderBy('totalAmount', 'DESC')
          .getRawMany();
      }, 600);

      return ok(res, summary);
    } catch (error) {
      logger.error('Error fetching payment methods summary:', error);
      return errorResponse(res, 'Failed to fetch payment methods summary');
    }
  }
}
