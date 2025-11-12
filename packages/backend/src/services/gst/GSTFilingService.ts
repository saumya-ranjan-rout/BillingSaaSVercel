import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { ProfessionalUser } from '../../entities/ProfessionalUser';
import { Tenant } from '../../entities/Tenant';
import logger from '../../utils/logger';

interface GSTRReturn {
  gstr1: any;
  gstr3b: any;
  gstr9: any;
}

export class GSTFilingService {
  private professionalRepository: Repository<ProfessionalUser>;
  private tenantRepository: Repository<Tenant>;

  constructor() {
    this.professionalRepository = AppDataSource.getRepository(ProfessionalUser);
    this.tenantRepository = AppDataSource.getRepository(Tenant);
  }

  async prepareGSTR1(professionalId: string, tenantId: string, period: string): Promise<any> {
    try {
      // Verify the professional has access to this tenant
      await this.verifyProfessionalAccess(professionalId, tenantId);

      // Generate GSTR-1 data
      const gstr1Data = await this.generateGSTR1Data(tenantId, period);

      return gstr1Data;
    } catch (error) {
      logger.error('Error preparing GSTR-1:', error);
      throw error;
    }
  }

  async prepareGSTR3B(professionalId: string, tenantId: string, period: string): Promise<any> {
    try {
      await this.verifyProfessionalAccess(professionalId, tenantId);
      
      const gstr3bData = await this.generateGSTR3BData(tenantId, period);
      
      return gstr3bData;
    } catch (error) {
      logger.error('Error preparing GSTR-3B:', error);
      throw error;
    }
  }

  async fileGSTRETurn(
    professionalId: string,
    tenantId: string,
    returnType: string,
    period: string,
    returnData: any
  ): Promise<{ success: boolean; acknowledgmentNumber: string }> {
    try {
      await this.verifyProfessionalAccess(professionalId, tenantId);

      // Validate return data
      this.validateReturnData(returnData);

      // File return with GST portal (this would integrate with GST API)
      const result = await this.submitToGSTPortal(tenantId, returnType, period, returnData);

      // Save filing record
      await this.saveFilingRecord(professionalId, tenantId, returnType, period, result);

      return result;
    } catch (error) {
      logger.error('Error filing GST return:', error);
      throw error;
    }
  }

  async getFilingHistory(professionalId: string, tenantId?: string): Promise<any[]> {
    try {
      let query = AppDataSource.getRepository('GSTFiling')
        .createQueryBuilder('filing')
        .leftJoinAndSelect('filing.tenant', 'tenant')
        .where('filing.professionalId = :professionalId', { professionalId });

      if (tenantId) {
        query = query.andWhere('filing.tenantId = :tenantId', { tenantId });
      }

      return query.orderBy('filing.filingDate', 'DESC').getMany();
    } catch (error) {
      logger.error('Error fetching filing history:', error);
      throw error;
    }
  }

  private async verifyProfessionalAccess(professionalId: string, tenantId: string): Promise<void> {
    const assignment = await AppDataSource.getRepository(ProfessionalTenant)
      .findOne({
        where: {
          professionalId,
          tenantId,
          isActive: true
        }
      });

    if (!assignment) {
      throw new Error('Professional does not have access to this tenant');
    }

    if (returnType.includes('GSTR') && !assignment.specificPermissions?.canFileGST) {
      throw new Error('Professional does not have GST filing permissions for this tenant');
    }
  }

  private async generateGSTR1Data(tenantId: string, period: string): Promise<any> {
    // Implementation to generate GSTR-1 data from invoices
    const invoices = await AppDataSource.getRepository('Invoice')
      .find({
        where: {
          tenantId,
          invoiceDate: Between(
            this.getPeriodStart(period),
            this.getPeriodEnd(period)
          )
        }
      });

    // Transform invoices into GSTR-1 format
    return this.transformToGSTR1(invoices);
  }

  private async generateGSTR3BData(tenantId: string, period: string): Promise<any> {
    // Implementation to generate GSTR-3B data
    return {};
  }

  private async submitToGSTPortal(
    tenantId: string,
    returnType: string,
    period: string,
    returnData: any
  ): Promise<{ success: boolean; acknowledgmentNumber: string }> {
    // This would integrate with the actual GST portal API
    // For now, return mock response
    return {
      success: true,
      acknowledgmentNumber: `ACK-${Date.now()}`
    };
  }

  private async saveFilingRecord(
    professionalId: string,
    tenantId: string,
    returnType: string,
    period: string,
    result: any
  ): Promise<void> {
    const filingRecord = {
      professionalId,
      tenantId,
      returnType,
      period,
      filingDate: new Date(),
      acknowledgmentNumber: result.acknowledgmentNumber,
      status: result.success ? 'filed' : 'failed'
    };

    await AppDataSource.getRepository('GSTFiling').save(filingRecord);
  }

  private validateReturnData(returnData: any): void {
    // Implement validation logic for GST return data
    if (!returnData) {
      throw new Error('Return data is required');
    }
    // Additional validation rules...
  }

  private getPeriodStart(period: string): Date {
    // Convert period string (e.g., "042024") to date
    return new Date();
  }

  private getPeriodEnd(period: string): Date {
    // Convert period string to date
    return new Date();
  }

  private transformToGSTR1(invoices: any[]): any {
    // Transform invoices to GSTR-1 format
    return {
      b2b: this.getB2BInvoices(invoices),
      b2cl: this.getB2CLInvoices(invoices),
      // ... other GSTR-1 sections
    };
  }

  private getB2BInvoices(invoices: any[]): any[] {
    return invoices.filter(inv => inv.customerGSTIN).map(inv => ({
      ctin: inv.customerGSTIN,
      inv: [{
        // Invoice details in GSTR-1 format
      }]
    }));
  }

  private getB2CLInvoices(invoices: any[]): any[] {
    return invoices.filter(inv => !inv.customerGSTIN && inv.totalAmount > 250000).map(inv => ({
      // B2CL invoice details
    }));
  }
}
