import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { SubscriptionPlan, PlanType, BillingCycle } from '../../entities/SubscriptionPlan';
import { TenantSubscription, SubscriptionStatus } from '../../entities/TenantSubscription';
import { Tenant } from '../../entities/Tenant';
import { ProfessionalUser } from '../../entities/ProfessionalUser';
import { StripeService } from '../billing/StripeService';
import logger from '../../utils/logger';
import { Injectable } from '@nestjs/common';
import { Subscription } from '../../entities/Subscription';
import { ISubscriptionService } from '../../interfaces/ISubscriptionService';

// @Injectable()
// export class SubscriptionService {
@Injectable()
export class SubscriptionService implements ISubscriptionService {
  private planRepository: Repository<SubscriptionPlan>;
  private subscriptionRepository: Repository<TenantSubscription>;
  private tenantRepository: Repository<Tenant>;
  private professionalRepository: Repository<ProfessionalUser>;
  private stripeService: StripeService;

  constructor() {
    this.planRepository = AppDataSource.getRepository(SubscriptionPlan);
    this.subscriptionRepository = AppDataSource.getRepository(TenantSubscription);
    this.tenantRepository = AppDataSource.getRepository(Tenant);
    this.professionalRepository = AppDataSource.getRepository(ProfessionalUser);
    this.stripeService = new StripeService();
  }

  async createSubscriptionPlan(planData: any): Promise<SubscriptionPlan> {
    try {
      const plan = this.planRepository.create(planData);
      return await this.planRepository.save(plan);
    } catch (error) {
      logger.error('Error creating subscription plan:', error);
      throw error;
    }
  }

   async createSubscription({
    tenantId,
    plan,
    status = 'active',
    currentPeriodStart,
    currentPeriodEnd,
    stripeSubscriptionId,
    stripeCustomerId
  }: {
    tenantId: string;
    plan: string;
    status?: 'active' | 'canceled' | 'past_due' | 'unpaid';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
  }) {
    const subscription = this.subscriptionRepository.create({
      tenantId,
      plan,
      status,
      currentPeriodStart,
      currentPeriodEnd,
      stripeSubscriptionId,
      stripeCustomerId,
      cancelAtPeriodEnd: false
    });
 
    return await this.subscriptionRepository.save(subscription);
  }

   
  async cancelAllSubscriptions(tenantId: string) {
    // Find all active subscriptions for this tenant
    const activeSubscriptions = await this.subscriptionRepository.find({
      where: {
        tenantId,
        status: 'active'
      }
    });
 
    // Cancel each subscription
    for (const subscription of activeSubscriptions) {
      subscription.status = 'canceled';
      subscription.cancelAtPeriodEnd = true;
      await this.subscriptionRepository.save(subscription);
    }
 
    return activeSubscriptions.length;
  }
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.planRepository.find({ where: { isActive: true } });
  }

  async subscribeTenant(
    tenantId: string,
    planId: string,
    paymentMethodId: string,
    professionalId?: string
  ): Promise<TenantSubscription> {
    try {
      const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
      const plan = await this.planRepository.findOne({ where: { id: planId } });

      if (!tenant || !plan) {
        throw new Error('Tenant or plan not found');
      }

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = this.calculateEndDate(startDate, plan.billingCycle);
      const trialEndDate = this.calculateTrialEndDate(startDate);

      // Create Stripe subscription
      const stripeSubscription = await this.stripeService.createSubscription(
        professionalId ? professionalId : tenantId,
        plan,
        paymentMethodId
      );

      const subscriptionData: any = {
        tenantId,
        planId: plan.id,
        startDate,
        endDate,
        trialEndDate,
        amount: plan.price,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeSubscription.customer as string,
        status: SubscriptionStatus.ACTIVE
      };

      if (professionalId) {
        const professional = await this.professionalRepository.findOne({ 
          where: { id: professionalId } 
        });
        if (professional) {
          subscriptionData.isPaidByProfessional = true;
          subscriptionData.paidByProfessionalId = professionalId;
        }
      }

      const subscription = this.subscriptionRepository.create(subscriptionData);
      return await this.subscriptionRepository.save(subscription);
    } catch (error) {
      logger.error('Error creating tenant subscription:', error);
      throw error;
    }
  }

  async professionalOnboardsTenant(
    professionalId: string,
    tenantData: any,
    planId: string,
    paymentMethodId: string
  ): Promise<{ tenant: Tenant; subscription: TenantSubscription }> {
    try {
      // First create the tenant
      const tenant = this.tenantRepository.create(tenantData);
      await this.tenantRepository.save(tenant);

      // Then create subscription paid by professional
      const subscription = await this.subscribeTenant(
        tenant.id,
        planId,
        paymentMethodId,
        professionalId
      );

      return { tenant, subscription };
    } catch (error) {
      logger.error('Error in professional onboarding tenant:', error);
      throw error;
    }
  }

  async getTenantSubscription(tenantId: string): Promise<TenantSubscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { tenantId },
      relations: ['plan', 'paidByProfessional'],
      order: { createdAt: 'DESC' }
    });

    if (!subscription) {
      throw new Error('Subscription not found for tenant');
    }

    return subscription;
  }

  async cancelSubscription(tenantId: string): Promise<void> {
    try {
      const subscription = await this.getTenantSubscription(tenantId);
      
      // Cancel Stripe subscription
      await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);
      
      // Update local subscription status
      await this.subscriptionRepository.update(
        { id: subscription.id },
        { status: SubscriptionStatus.CANCELLED }
      );
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  async updateSubscription(tenantId: string, planId: string): Promise<TenantSubscription> {
    try {
      const currentSubscription = await this.getTenantSubscription(tenantId);
      const newPlan = await this.planRepository.findOne({ where: { id: planId } });

      if (!newPlan) {
        throw new Error('New plan not found');
      }

      // Update Stripe subscription
      const updatedStripeSubscription = await this.stripeService.updateSubscription(
        currentSubscription.stripeSubscriptionId,
        newPlan
      );

      // Update local subscription
      await this.subscriptionRepository.update(
        { id: currentSubscription.id },
        {
          planId: newPlan.id,
          amount: newPlan.price,
          endDate: this.calculateEndDate(new Date(), newPlan.billingCycle)
        }
      );

      return this.getTenantSubscription(tenantId);
    } catch (error) {
      logger.error('Error updating subscription:', error);
      throw error;
    }
  }

  private calculateEndDate(startDate: Date, billingCycle: BillingCycle): Date {
    const endDate = new Date(startDate);
    
    switch (billingCycle) {
      case BillingCycle.MONTHLY:
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case BillingCycle.QUARTERLY:
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case BillingCycle.ANNUALLY:
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    
    return endDate;
  }

  private calculateTrialEndDate(startDate: Date): Date {
    const trialEndDate = new Date(startDate);
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial
    return trialEndDate;
  }

  async getProfessionalSubscriptions(professionalId: string): Promise<TenantSubscription[]> {
    return this.subscriptionRepository.find({
      where: { paidByProfessionalId: professionalId },
      relations: ['tenant', 'plan']
    });
  }
}
