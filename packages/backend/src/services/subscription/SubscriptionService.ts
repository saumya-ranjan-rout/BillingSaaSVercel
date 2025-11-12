import { Repository, MoreThan, In } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Subscription, SubscriptionStatus } from '../../entities/Subscription';
import { SubscriptionPlan } from '../../entities/SubscriptionPlan';
import { Payment, PaymentStatus, PaymentGateway } from '../../entities/Payment';
import { User } from '../../entities/User';
import { Tenant } from '../../entities/Tenant';
import logger from '../../utils/logger';
import { Plan } from '@/entities';

export class SubscriptionService {
  private subscriptionRepository: Repository<Subscription>;
  private planRepository: Repository<SubscriptionPlan>;
  private paymentRepository: Repository<Payment>;
  private userRepository: Repository<User>;

  constructor() {
    this.subscriptionRepository = AppDataSource.getRepository(Subscription);
    this.planRepository = AppDataSource.getRepository(SubscriptionPlan);
    this.paymentRepository = AppDataSource.getRepository(Payment);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getActivePlans(): Promise<SubscriptionPlan[]> {
    return this.planRepository.find({
      where: { isActive: true },
      order: { price: 'ASC' },
    });
  }


  // Create subscription + payment record (status: pending) and return both
  async createSubscription(
    userId: string,
    planId: string,
    paymentGateway: PaymentGateway = PaymentGateway.RAZORPAY
  ): Promise<{ subscription: Subscription; payment: Payment }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        tenantId: user.tenantId,
         status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL]),
        endDate: MoreThan(new Date()), // endDate > today
      },
      order: { endDate: 'DESC' },
    });

    let startDate: Date;
    let endDate: Date;

    if (existingSubscription) {
      // Extend new subscription from previous end date
      startDate = new Date(existingSubscription.endDate);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (plan.validityDays || 365));
    } else {
      // Start new subscription from today
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(endDate.getDate() + (plan.validityDays || 365));
    }


      const subscription = this.subscriptionRepository.create({
        userId,
        planId: plan.id,
        status: SubscriptionStatus.PENDING,
        startDate,
        endDate,
        autoRenew: false,
        tenantId: user.tenantId,
        metadata: { createdBy: 'system' },
      });

      const savedSubscription = await queryRunner.manager.save(Subscription, subscription);

      const payment = this.paymentRepository.create({
        userId,
        subscriptionId: savedSubscription.id,
        amount: plan.price,
        currency: plan.currency || 'INR',
        status: PaymentStatus.PENDING,
        gateway: paymentGateway, // ✅ Enum instead of string
        description: `Subscription payment for ${plan.name}`,
        tenantId: user.tenantId,
      } as Payment); // ✅ Ensure TS sees this as a Payment object

      const savedPayment = await queryRunner.manager.save(Payment, payment);

      await queryRunner.commitTransaction();
      return { subscription: savedSubscription, payment: savedPayment };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      logger.error('createSubscription error:', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
async activateFreeTrial(subscriptionId: string): Promise<void> {
  const subscriptionRepo = AppDataSource.getRepository(Subscription);
  const subscription = await subscriptionRepo.findOne({ where: { id: subscriptionId } });

  if (!subscription) throw new Error('Subscription not found');

 subscription.status = SubscriptionStatus.TRIAL;
  subscription.startDate = new Date();
  subscription.endDate = new Date(
    new Date().setDate(new Date().getDate() + 5) // example 5-day trial
  );

  await subscriptionRepo.save(subscription);
}

  // Process payment success: activate subscription and update payment
  async processPaymentSuccess(
    paymentId: string,
    gatewayPaymentId: string,
    gatewayResponse: Record<string, any>
  ): Promise<{ subscription: Subscription; payment: Payment }> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = await this.paymentRepository.findOne({
        where: { id: paymentId },
        relations: ['subscription', 'subscription.plan'],
      });

      if (!payment) throw new Error('Payment not found');

      payment.status = PaymentStatus.COMPLETED;
      payment.gatewayPaymentId = gatewayPaymentId;
      payment.gatewayResponse = gatewayResponse;
      payment.paidAt = new Date();

      await queryRunner.manager.save(Payment, payment);

      const subscription = payment.subscription;
      subscription.status = SubscriptionStatus.ACTIVE;

      const updatedSubscription = await queryRunner.manager.save(Subscription, subscription);

      await this.updateUserLimits(subscription.userId, subscription.plan);

      await queryRunner.commitTransaction();
      return { subscription: updatedSubscription, payment };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('processPaymentSuccess error:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Cancel subscription for user
  async cancelSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
    });

    if (!subscription) throw new Error('No active subscription found');

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    subscription.autoRenew = false;

    return await this.subscriptionRepository.save(subscription);
  }

  // Get user's current subscription (latest)
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: { userId },
      relations: ['plan', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  // Return subscription history with computed statuses
  async getUserSubscriptionHistory(userId: string, tenantId?: string): Promise<any[]> {
    const subs = await this.subscriptionRepository.find({
      where: tenantId ? { tenantId } : { userId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });

    const now = new Date();

    return subs.map((s) => {
      const end = s.endDate ? new Date(s.endDate) : null;
      let status = s.status;

      if (s.status === SubscriptionStatus.ACTIVE && end && end < now) {
        status = SubscriptionStatus.EXPIRED;
      } else if (
        [SubscriptionStatus.CANCELLED, SubscriptionStatus.EXPIRED, SubscriptionStatus.INACTIVE].includes(s.status)
      ) {
        status = SubscriptionStatus.EXPIRED;
      } else if (s.status === SubscriptionStatus.PENDING) {
        status = SubscriptionStatus.PENDING;
      } else if (s.status === SubscriptionStatus.TRIAL) {
        status = SubscriptionStatus.TRIAL;
      } else if (s.status === SubscriptionStatus.ACTIVE) {
        status = SubscriptionStatus.ACTIVE;
      }


    // Check expiry based on endDate
    // if (end && end < now) {
    //   status = SubscriptionStatus.EXPIRED;
    // } else if (end && end >= now) {
    //   status = SubscriptionStatus.ACTIVE;
    // } else if (!end) {
    //   // If no end date, keep existing status or set default
    //   status = status || SubscriptionStatus.PENDING;
    // }
      return {
        id: s.id,
        planId: s.planId,
        planName: s.plan?.name || 'Plan',
        status,
        startDate: s.startDate,
        endDate: s.endDate,
        createdAt: s.createdAt,
        metadata: s.metadata,
      };
    });
  }

  private async updateUserLimits(userId: string, plan: any): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && user.tenantId) {
      logger.info(`Updated limits for user ${userId} based on plan ${plan?.name}`);
    }
  }

  async getSubscriptionStats(tenantId: string): Promise<any> {
    const totalSubscriptions = await this.subscriptionRepository.count({ where: { tenantId } });

    const activeSubscriptions = await this.subscriptionRepository.count({
      where: { tenantId, status: SubscriptionStatus.ACTIVE },
    });

    const revenueResult = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.tenantId = :tenantId', { tenantId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne();

    const monthlyRevenueResult = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.tenantId = :tenantId', { tenantId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .andWhere('payment.createdAt >= :startDate', {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      })
      .getRawOne();

    return {
      totalSubscriptions,
      activeSubscriptions,
      totalRevenue: parseFloat(revenueResult?.total || 0),
      monthlyRecurringRevenue: parseFloat(monthlyRevenueResult?.total || 0),
    };
  }

  async createTenantSubscription(data: {
    tenantId: string;
    planId: string;
    paymentGateway?: PaymentGateway;
    status?: SubscriptionStatus;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { tenantId, planId, paymentGateway = PaymentGateway.RAZORPAY, status, startDate, endDate } = data;

    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const subscription = this.subscriptionRepository.create({
        tenantId,
        planId: plan.id,
        status: status || SubscriptionStatus.PENDING,
        startDate: startDate || new Date(),
        endDate:
          endDate ||
          (() => {
            const d = new Date();
            d.setDate(d.getDate() + (plan.validityDays || 30));
            return d;
          })(),
        autoRenew: false,
        metadata: { createdBy: 'system' },
      });

      const savedSubscription = await queryRunner.manager.save(Subscription, subscription);

      if (status !== SubscriptionStatus.TRIAL) {
        const payment = this.paymentRepository.create({
          tenantId,
          subscriptionId: savedSubscription.id,
          amount: plan.price,
          currency: plan.currency || 'INR',
          status: PaymentStatus.PENDING,
          gateway: paymentGateway,
          description: `Subscription payment for ${plan.name}`,
        } as Payment);

        await queryRunner.manager.save(Payment, payment);
      }

      await queryRunner.commitTransaction();
      return savedSubscription;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelAllSubscriptions(tenantId: string) {
    const activeSubs = await this.subscriptionRepository.find({
      where: { tenantId, status: SubscriptionStatus.ACTIVE },
    });
    for (const sub of activeSubs) {
      sub.status = SubscriptionStatus.CANCELLED;
      sub.cancelledAt = new Date();
      sub.autoRenew = false;
      await this.subscriptionRepository.save(sub);
    }
    return activeSubs;
  }

  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
  return this.planRepository.findOne({ where: { id: planId } });
}

async createSubscriptionAfterPayment(
  userId: string,
  tenantId: string,
  planId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string
): Promise<{ subscription: Subscription; payment: Payment }> {
  const plan = await this.planRepository.findOne({ where: { id: planId } });
  if (!plan) throw new Error('Plan not found');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (plan.validityDays || 365));

    const subscription = this.subscriptionRepository.create({
      userId,
      tenantId,
      planId,
      status: SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      autoRenew: false,
      metadata: { razorpayOrderId },
    });

    const savedSubscription = await queryRunner.manager.save(Subscription, subscription);

    const payment = this.paymentRepository.create({
      userId,
      tenantId,
      subscriptionId: savedSubscription.id,
      amount: plan.price,
      currency: plan.currency || 'INR',
      gateway: PaymentGateway.RAZORPAY,
      status: PaymentStatus.COMPLETED,
      gatewayPaymentId: razorpayPaymentId,
      description: `Subscription payment for ${plan.name}`,
      paidAt: new Date(),
    });

    const savedPayment = await queryRunner.manager.save(Payment, payment);

    await queryRunner.commitTransaction();
    return { subscription: savedSubscription, payment: savedPayment };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    logger.error('createSubscriptionAfterPayment error:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
}

