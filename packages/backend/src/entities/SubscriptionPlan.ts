import { Entity, Column, OneToMany, Index } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Subscription } from './Subscription';

export enum PlanType {
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

export enum BillingCycle {
  FIVE_DAYS = '5days',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity('subscription_plans')
@Index(['tenantId', 'isActive'])
export class SubscriptionPlan extends TenantAwareEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: PlanType, default: PlanType.BASIC })
  type: PlanType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency: string;

  @Column({ type: 'enum', enum: BillingCycle, default: BillingCycle.YEARLY })
  billingCycle: BillingCycle;

  @Column({ type: 'integer', default: 1 })
  maxTenants: number;

  @Column({ type: 'integer', default: 1 })
  maxBusinesses: number;

  @Column({ type: 'integer', default: 5 })
  maxUsers: number;

  @Column({ type: 'jsonb', nullable: true })
  features: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  trialDays: number;

  @Column({ type: 'integer', default: 365 }) // 1 year in days
  validityDays: number;

  @OneToMany(() => Subscription, subscription => subscription.plan)
  subscriptions: Subscription[];

  
}
