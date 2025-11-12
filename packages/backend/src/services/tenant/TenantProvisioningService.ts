
import { User, UserRole, UserStatus } from '../../entities/User';
import { TenantService } from './TenantService';
import { UserService } from '../auth/UserService';
import { SubscriptionService } from '../subscription/SubscriptionService';
import { AppDataSource } from '../../config/database';
import { Tenant, TenantStatus } from '../../entities/Tenant';
// import { BillingCycle, SubscriptionStatus } from '../../entities/Subscription';
import { BillingCycle } from '../../entities/SubscriptionPlan'; // ✅ Correct import
import { SubscriptionStatus } from '../../entities/Subscription';

const planId = 'free_trial'; // or get it from somewhere in your code
 
// Define trial duration (e.g., 14 days trial)
const trialDays = 14;
const trialEndDate = new Date();
trialEndDate.setDate(trialEndDate.getDate() + trialDays);
const billingCycle = 'monthly';

export class TenantProvisioningService {
  private tenantService: TenantService;
  private userService: UserService;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.tenantService = new TenantService();
    this.userService = new UserService();
    this.subscriptionService = new SubscriptionService();
  }

  
 async provisionNewTenant(
    tenantData: Partial<Tenant>,
    adminUserData: Partial<User>
  ): Promise<{ tenant: Tenant; adminUser: User }> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tenant = await this.tenantService.createTenant(tenantData);

      const adminUser = await this.userService.createUser({
        ...adminUserData,
        tenantId: tenant.id,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      });

await this.subscriptionService.createTenantSubscription({
  tenantId: tenant.id,
  planId: planId,
  status: SubscriptionStatus.TRIAL,
  startDate: new Date(),
  endDate: trialEndDate,
});


      await queryRunner.commitTransaction();
      return { tenant, adminUser };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deprovisionTenant(tenantId: string): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cancel all subscriptions
      await this.subscriptionService.cancelAllSubscriptions(tenantId);

      // Soft delete all users
      await this.userService.deactivateAllUsers(tenantId);

      // Update tenant status
      await this.tenantService.updateTenantStatus(tenantId, TenantStatus.SUSPENDED);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
