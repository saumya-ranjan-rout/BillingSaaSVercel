import { Tenant, TenantStatus } from '../../entities/Tenant';
import { BaseService } from '../BaseService';
import { StripeService } from '../billing/StripeService';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { FindOptionsWhere } from 'typeorm';
 import { AppDataSource } from '../../config/database';
export class TenantService extends BaseService<Tenant> {
  private stripeService: StripeService;
 
  constructor() {
    // super(Tenant);
       super(AppDataSource.getRepository(Tenant)); 
    this.stripeService = new StripeService();
  }
 
  async createTenant(data: Partial<Tenant>): Promise<Tenant> {
    // Check if slug exists
    const existingTenant = await this.repository.findOne({
      where: { slug: data.slug } as FindOptionsWhere<Tenant>,
    });
 
    if (existingTenant) {
      throw new BadRequestError('Tenant slug already exists');
    }
 
    // Create tenant with trial status
    const tenant = await this.create({
      ...data,
      status: TenantStatus.TRIAL,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
 
    try {
      // Create Stripe customer
      const stripeCustomer = await this.stripeService.createCustomer({
        name: tenant.name,
        metadata: {
          tenantId: tenant.id,
        },
      });
 
      // Update tenant with Stripe customer ID
      await this.update(tenant.id, {
        stripeCustomerId: stripeCustomer.id,
      } as Partial<Tenant>);
    } catch (error) {
      // If Stripe fails, delete the tenant
      await this.delete(tenant.id);
      throw new BadRequestError('Failed to create tenant in payment system');
    }
 
    // Return the updated tenant
    return this.getTenantById(tenant.id);
  }
 
  async updateTenantStatus(id: string, status: TenantStatus): Promise<Tenant> {
    return this.update(id, { status } as Partial<Tenant>);
  }
 
  async getTenantBySlug(slug: string): Promise<Tenant> {
    const tenant = await this.repository.findOne({
      where: { slug } as FindOptionsWhere<Tenant>,
    });
    
    if (!tenant) throw new NotFoundError('Tenant not found');
    return tenant;
  }
 
  async getTenantUsage(tenantId: string): Promise<{
    userCount: number;
    invoiceCount: number;
    customerCount: number;
  }> {
    // Implement actual usage counting logic here
    return {
      userCount: 0,
      invoiceCount: 0,
      customerCount: 0,
    };
  }
 
  async getTenantById(id: string): Promise<Tenant> {
    const tenant = await this.repository.findOne({
      where: { id } as FindOptionsWhere<Tenant>,
    });
    
    if (!tenant) throw new NotFoundError('Tenant not found');
    return tenant;
  }
 
  async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    await this.repository.update(id, updates);
    return this.getTenantById(id);
  }
}