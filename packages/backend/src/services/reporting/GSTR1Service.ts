import { Between } from 'typeorm';
import { Invoice, InvoiceStatus } from '../../entities/Invoice';
import { AppDataSource } from '../../config/database';
import { GSTCalculationService } from '../billing/GSTCalculationService';

export class GSTR1Service {
  private invoiceRepository = AppDataSource.getRepository(Invoice);
  private gstCalculationService = new GSTCalculationService();

  async generateGSTR1Report(tenantId: string, period: string): Promise<any> {
    const [month, year] = period.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    // Get all invoices for the period
    const invoices = await this.invoiceRepository.find({
      where: {
        tenantId,
        issueDate: Between(startDate, endDate),
        status: In([InvoiceStatus.ISSUED, InvoiceStatus.PAID]),
      } as any,
      relations: ['items', 'customer', 'gstin'],
    });

    // Generate GSTR-1 report
    return this.gstCalculationService.calculateGSTR1Report(tenantId, period);
  }

  async generateGSTR1JSON(tenantId: string, period: string): Promise<string> {
    const report = await this.generateGSTR1Report(tenantId, period);
    return JSON.stringify(report, null, 2);
  }

  async generateGSTR1Excel(tenantId: string, period: string): Promise<Buffer> {
    const report = await this.generateGSTR1Report(tenantId, period);
    // Implementation would convert JSON to Excel format
    return Buffer.from(''); // Placeholder
  }
}
