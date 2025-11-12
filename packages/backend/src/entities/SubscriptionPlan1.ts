import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export enum PlanType {
  TENANT = 'tenant',
  PROFESSIONAL = 'professional'
}

export enum BillingPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime'
}

@Entity('subscription_plans')
export class SubscriptionPlan extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: PlanType })
  planType: PlanType;

  @Column({ type: 'enum', enum: BillingPeriod, default: BillingPeriod.YEARLY })
  billingPeriod: BillingPeriod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

  @Column({ type: 'jsonb' })
  features: string[];

  @Column({ type: 'jsonb', default: {} })
  limits: {
    users?: number;
    customers?: number;
    invoices?: number;
    products?: number;
    storageMB?: number;
    clients?: number; // For professionals
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', default: 0 })
  trialDays: number;
}
