import { AppDataSource } from '../config/database';
import { Tenant } from '../entities/Tenant';
import { User, UserRole } from '../entities/User';
import { SubscriptionPlan, PlanType, BillingCycle } from '../entities/SubscriptionPlan';
import logger from '../utils/logger';
import { TenantStatus } from '../entities/Tenant';
const seed = async () => {
  try {
    const connection = await AppDataSource.initialize();
    logger.info('Database connection established for seeding');

    // -------------------------------
    // 1. Create default subscription plans
    // -------------------------------
    const planRepository = connection.getRepository(SubscriptionPlan);

    const plans = planRepository.create([
      {
        planType: PlanType.BASIC,
        name: 'Basic',
        description: 'Basic plan with limited features',
        price: 999,
        billingCycle: BillingCycle.MONTHLY,
        features: {
          maxUsers: 2,
          maxStorage: 500,
          gstFiling: false,
          taxFiling: false,
          advancedReporting: false,
          apiAccess: false,
          prioritySupport: false,
        },
      },
      {
        planType: PlanType.PREMIUM,
        name: 'Professional',
        description: 'Professional plan with extended features',
        price: 2999,
        billingCycle: BillingCycle.MONTHLY,
        features: {
          maxUsers: 5,
          maxStorage: 2000,
          gstFiling: true,
          taxFiling: true,
          advancedReporting: true,
          apiAccess: false,
          prioritySupport: true,
        },
      },
      {
        planType: PlanType.ENTERPRISE,
        name: 'Enterprise',
        description: 'Enterprise plan with all features',
        price: 4999,
        billingCycle: BillingCycle.MONTHLY,
        features: {
          maxUsers: 10,
          maxStorage: 10000,
          gstFiling: true,
          taxFiling: true,
          advancedReporting: true,
          apiAccess: true,
          prioritySupport: true,
        },
      },
    ]);

    await planRepository.save(plans);
    logger.info('Subscription plans created');

    // -------------------------------
    // 2. Fetch Enterprise plan for default tenant
    // -------------------------------
    const enterprisePlan = await planRepository.findOne({
      where: { name: 'Enterprise' },
    });

    if (!enterprisePlan) {
      throw new Error('Enterprise plan not found!');
    }

    // -------------------------------
    // 3. Create default tenant
    // -------------------------------
    const tenantRepository = connection.getRepository(Tenant);
const tenant = tenantRepository.create({
  name: 'Default Tenant',
  businessName: 'Default Business',
  subdomain: 'default',
  slug: 'default-tenant',
  status: TenantStatus.ACTIVE,
  isActive: true,
});
    await tenantRepository.save(tenant);
    logger.info('Default tenant created');

    // -------------------------------
    // 4. Create Admin user
    // -------------------------------
    const userRepository = connection.getRepository(User);

    const adminUser = userRepository.create({
      email: 'admin@demo.com',
      password: '123456', // will be auto-hashed by @BeforeInsert in User.ts
      firstName: 'System',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      tenant: tenant,
    });

    await userRepository.save(adminUser);
    logger.info('Admin user created');

    // -------------------------------
    // 5. Close connection
    // -------------------------------
    await connection.destroy();
    logger.info('Seeding completed successfully ✅');
  } catch (error: any) {
    logger.error('Seeding error: ' + error.message, error);
    process.exit(1);
  }
};

seed();
