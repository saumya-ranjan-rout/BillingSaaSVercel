import { Between } from 'typeorm';
import { Invoice, InvoiceStatus } from '../../entities/Invoice';
import { AppDataSource } from '../../config/database';

export interface FinancialReport {
  period: string;
  totalRevenue: number;
  totalTax: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  revenueByTaxRate: Array<{
    rate: number;
    revenue: number;
    tax: number;
  }>;
  revenueByCustomer: Array<{
    customerId: string;
    customerName: string;
    revenue: number;
    invoices: number;
  }>;
}

export class FinancialReportService {
  private invoiceRepository = AppDataSource.getRepository(Invoice);

  async generateFinancialReport(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<FinancialReport> {
    // Get invoices for the period
    const invoices = await this.invoiceRepository.find({
      where: {
        tenantId,
        issueDate: Between(startDate, endDate),
      } as any,
      relations: ['customer', 'items'],
    });

    // Calculate totals
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalTax = invoices.reduce((sum, inv) => sum + inv.tax, 0);
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.status === InvoiceStatus.PAID).length;
    const overdueInvoices = invoices.filter(
      inv => inv.status === InvoiceStatus.OVERDUE
    ).length;

    // Group by tax rate
    const revenueByTaxRate = this.calculateRevenueByTaxRate(invoices);

    // Group by customer
    const revenueByCustomer = this.calculateRevenueByCustomer(invoices);

    return {
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      totalRevenue,
      totalTax,
      totalInvoices,
      paidInvoices,
      overdueInvoices,
      revenueByTaxRate,
      revenueByCustomer,
    };
  }

  private calculateRevenueByTaxRate(invoices: Invoice[]): Array<{
    rate: number;
    revenue: number;
    tax: number;
  }> {
    const taxGroups: Map<number, { revenue: number; tax: number }> = new Map();

    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const rate = item.taxRate;
        if (!taxGroups.has(rate)) {
          taxGroups.set(rate, { revenue: 0, tax: 0 });
        }

        const group = taxGroups.get(rate);
        if (group) {
          group.revenue += item.amount;
          group.tax += item.taxAmount;
        }
      });
    });

    return Array.from(taxGroups.entries()).map(([rate, { revenue, tax }]) => ({
      rate,
      revenue,
      tax,
    }));
  }

  private calculateRevenueByCustomer(invoices: Invoice[]): Array<{
    customerId: string;
    customerName: string;
    revenue: number;
    invoices: number;
  }> {
    const customerGroups: Map<
      string,
      { customerName: string; revenue: number; invoices: number }
    > = new Map();

    invoices.forEach(invoice => {
      const customerId = invoice.customer.id;
      const customerName = invoice.customer.name;

      if (!customerGroups.has(customerId)) {
        customerGroups.set(customerId, {
          customerName,
          revenue: 0,
          invoices: 0,
        });
      }

      const group = customerGroups.get(customerId);
      if (group) {
        group.revenue += invoice.total;
        group.invoices += 1;
      }
    });

    return Array.from(customerGroups.entries()).map(
      ([customerId, { customerName, revenue, invoices }]) => ({
        customerId,
        customerName,
        revenue,
        invoices,
      })
    );
  }
}
