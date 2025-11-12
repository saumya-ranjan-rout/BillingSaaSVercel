import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { ProfessionalUser, ProfessionalType } from '../../entities/ProfessionalUser';
import { ProfessionalTenant } from '../../entities/ProfessionalTenant';
import { Tenant } from '../../entities/Tenant';
import { User } from '../../entities/User';
import logger from '../../utils/logger';

export class ProfessionalService {
  private professionalRepository: Repository<ProfessionalUser>;
  private professionalTenantRepository: Repository<ProfessionalTenant>;
  private tenantRepository: Repository<Tenant>;
  private userRepository: Repository<User>;

  constructor() {
    this.professionalRepository = AppDataSource.getRepository(ProfessionalUser);
    this.professionalTenantRepository = AppDataSource.getRepository(ProfessionalTenant);
    this.tenantRepository = AppDataSource.getRepository(Tenant);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async registerProfessional(
    userData: any,
    professionalData: any
  ): Promise<ProfessionalUser> {
    try {
      // First create the user
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);

      // Then create the professional profile
      const professional = this.professionalRepository.create({
        ...professionalData,
        userId: user.id
      });

      return await this.professionalRepository.save(professional);
    } catch (error) {
      logger.error('Error registering professional:', error);
      throw error;
    }
  }

  async assignProfessionalToTenant(
    professionalId: string,
    tenantId: string,
    permissions: any = null
  ): Promise<ProfessionalTenant> {
    try {
      const assignment = this.professionalTenantRepository.create({
        professionalId,
        tenantId,
        specificPermissions: permissions
      });

      return await this.professionalTenantRepository.save(assignment);
    } catch (error) {
      logger.error('Error assigning professional to tenant:', error);
      throw error;
    }
  }

  async getProfessionalTenants(professionalId: string): Promise<Tenant[]> {
    try {
      const assignments = await this.professionalTenantRepository.find({
        where: { professionalId, isActive: true },
        relations: ['tenant']
      });

      return assignments.map(assignment => assignment.tenant);
    } catch (error) {
      logger.error('Error fetching professional tenants:', error);
      throw error;
    }
  }

  async getTenantProfessionals(tenantId: string): Promise<ProfessionalUser[]> {
    try {
      const assignments = await this.professionalTenantRepository.find({
        where: { tenantId, isActive: true },
        relations: ['professional', 'professional.user']
      });

      return assignments.map(assignment => assignment.professional);
    } catch (error) {
      logger.error('Error fetching tenant professionals:', error);
      throw error;
    }
  }

  async updateProfessionalPermissions(
    professionalId: string,
    tenantId: string,
    permissions: any
  ): Promise<ProfessionalTenant> {
    try {
      await this.professionalTenantRepository.update(
        { professionalId, tenantId },
        { specificPermissions: permissions }
      );

      return this.professionalTenantRepository.findOneOrFail({
        where: { professionalId, tenantId }
      });
    } catch (error) {
      logger.error('Error updating professional permissions:', error);
      throw error;
    }
  }

  async getProfessionalDashboard(professionalId: string) {
    try {
      const tenants = await this.getProfessionalTenants(professionalId);
      
      // Get upcoming compliance dates for all tenants
      const complianceData = await this.getUpcomingComplianceDates(professionalId);
      
      // Get recent activities across all tenants
      const recentActivities = await this.getRecentActivities(professionalId);
      
      // Get financial summaries
      const financialSummary = await this.getFinancialSummary(professionalId);

      return {
        tenants,
        complianceData,
        recentActivities,
        financialSummary
      };
    } catch (error) {
      logger.error('Error fetching professional dashboard:', error);
      throw error;
    }
  }

  private async getUpcomingComplianceDates(professionalId: string): Promise<any[]> {
    // Implementation for fetching GST due dates, tax filing dates, etc.
    // This would integrate with your compliance service
    return [];
  }

  private async getRecentActivities(professionalId: string): Promise<any[]> {
    // Implementation for fetching recent activities across all managed tenants
    return [];
  }

  private async getFinancialSummary(professionalId: string): Promise<any> {
    // Implementation for financial summary across all managed tenants
    return {};
  }
}
