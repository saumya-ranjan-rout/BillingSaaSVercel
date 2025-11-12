import { Between, IsNull } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Invoice } from '../../entities/Invoice';
import { Customer } from '../../entities/Customer';
import { Payment } from '../../entities/Payment';
import { CacheService } from '../cache/CacheService';
import logger from '../../utils/logger';

export class DashboardService {
  private cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService();
  }




  async getDashboardData(tenantId: string) {
    const cacheKey = CacheService.Keys.tenantDashboard(tenantId);

    return await this.cacheService.getOrSet(cacheKey, async () => {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const yearStart = new Date(today.getFullYear(), 0, 1);

      // ⚡ One aggregate query for counts + revenue
      const aggregate = await AppDataSource.getRepository(Invoice)
        .createQueryBuilder('invoice')
        .select([
          `COUNT(*)::int AS total_invoices`,
          `SUM(CASE WHEN invoice.status = 'pending' THEN 1 ELSE 0 END)::int AS pending_invoices`,
          `SUM(CASE WHEN invoice.issueDate >= :monthStart THEN invoice.totalAmount ELSE 0 END)::numeric AS monthly_revenue`,
          `SUM(CASE WHEN invoice.issueDate >= :yearStart THEN invoice.totalAmount ELSE 0 END)::numeric AS yearly_revenue`
        ])
        .where('invoice.tenantId = :tenantId', { tenantId })
        .andWhere('invoice.deletedAt IS NULL')
        .setParameters({ monthStart, yearStart })
        .getRawOne();

      const totalCustomers = await AppDataSource.getRepository(Customer).count({
        where: { tenantId, deletedAt: null },
      });

      // ⚡ Fetch only small sets (limit 5)
      const recentInvoices = await AppDataSource.getRepository(Invoice).find({
        where: { tenantId, deletedAt: null },
        relations: ['customer'],
        take: 5,
        order: { createdAt: 'DESC' },
      });

      const pendingInvoices = await AppDataSource.getRepository(Invoice).find({
        where: { tenantId, status: 'pending', deletedAt: null },
        relations: ['customer'],
        take: 5,
        order: { dueDate: 'ASC' },
      });

      const overdueInvoices = await AppDataSource.getRepository(Invoice)
        .createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.customer', 'customer')
        .where('invoice.tenantId = :tenantId', { tenantId })
        .andWhere('invoice.dueDate < :today', { today })
        .andWhere('invoice.status IN (:...statuses)', {
          statuses: ['sent', 'viewed', 'partial'],
        })
        .andWhere('invoice.deletedAt IS NULL')
        .orderBy('invoice.dueDate', 'ASC')
        .take(5)
        .getMany();

      // ✅ Final small response
      return {
        summary: {
          totalInvoices: Number(aggregate?.total_invoices || 0),
          totalCustomers,
          monthlyRevenue: parseFloat(aggregate?.monthly_revenue || '0'),
          yearlyRevenue: parseFloat(aggregate?.yearly_revenue || '0'),
          pendingInvoices: Number(aggregate?.pending_invoices || 0),
          overdueInvoices: overdueInvoices.length,
        },
        recentInvoices,
        pendingInvoices,
        overdueInvoices,
        charts: {
          monthlyRevenue: await this.getMonthlyRevenueChart(tenantId),
          invoiceStatus: await this.getInvoiceStatusChart(tenantId),
        },
      };
    }, 300); // cache for 5 minutes
  }

  
  private async getTotalInvoices(tenantId: string): Promise<number> {
    const repo = AppDataSource.getRepository(Invoice);
    return await repo.count({
      where: { tenantId, deletedAt: IsNull() }
    });
  }

  private async getTotalCustomers(tenantId: string): Promise<number> {
    const repo = AppDataSource.getRepository(Customer);
    return await repo.count({
      where: { tenantId, deletedAt: IsNull() }
    });
  }

  private async getRevenue(tenantId: string, from: Date, to: Date): Promise<number> {
    const repo = AppDataSource.getRepository(Invoice);
    const result = await repo
      .createQueryBuilder('invoice')
      .select('SUM(invoice.totalAmount)', 'total')
      .where('invoice.tenantId = :tenantId', { tenantId })
      .andWhere('invoice.issueDate BETWEEN :from AND :to', { from, to })
      .andWhere('invoice.deletedAt IS NULL')
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  private async getPendingInvoices(tenantId: string) {
    const repo = AppDataSource.getRepository(Invoice);
    return await repo.find({
      where: { 
        tenantId, 
        status: 'pending',
        deletedAt: IsNull() 
      },
      relations: ['customer'],
      take: 10,
      order: { dueDate: 'ASC' }
    });
  }

  private async getRecentInvoices(tenantId: string) {
    const repo = AppDataSource.getRepository(Invoice);
    return await repo.find({
      where: { tenantId, deletedAt: IsNull() },
      relations: ['customer'],
      take: 5,
      order: { createdAt: 'DESC' }
    });
  }

  private async getOverdueInvoices(tenantId: string) {
    const repo = AppDataSource.getRepository(Invoice);
    const today = new Date();
    
    return await repo
      .createQueryBuilder('invoice')
      .where('invoice.tenantId = :tenantId', { tenantId })
      .andWhere('invoice.dueDate < :today', { today })
      .andWhere('invoice.status IN (:...statuses)', { 
        statuses: ['sent', 'viewed', 'partial'] 
      })
      .andWhere('invoice.deletedAt IS NULL')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .orderBy('invoice.dueDate', 'ASC')
      .take(10)
      .getMany();
  }

  private async getMonthlyRevenueChart(tenantId: string) {
    // Implementation for monthly revenue chart data
    return [/* chart data */];
  }

  private async getInvoiceStatusChart(tenantId: string) {
    // Implementation for invoice status chart data
    return [/* chart data */];
  }
}
