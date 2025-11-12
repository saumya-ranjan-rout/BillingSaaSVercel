import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { ProfessionalUser } from './ProfessionalUser';
import { SubscriptionPlan } from './SubscriptionPlan';
import { SubscriptionChange } from './SubscriptionChange';
import { Payment } from './Payment';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAUSED = 'paused',
     TRIALING = 'trialing',
}

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  MANUAL = 'manual'
}
export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity('subscriptions')
export class Subscription extends TenantAwareEntity {
  @Column()
  planId: string;

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => Tenant, { nullable: true })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ nullable: true })
  professionalId: string;

  @ManyToOne(() => ProfessionalUser, { nullable: true })
  @JoinColumn({ name: 'professionalId' })
  professional: ProfessionalUser;

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING })
  status: SubscriptionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @Column({ type: 'enum', enum: PaymentGateway, default: PaymentGateway.RAZORPAY })
  paymentGateway: PaymentGateway;

  @Column({ nullable: true })
  paymentGatewayId: string;

  @Column({ nullable: true })
  paymentGatewaySubscriptionId: string;

  @Column({ type: 'jsonb', nullable: true })
  paymentDetails: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ default: false })
  autoRenew: boolean;

  @Column({ type: 'timestamp', nullable: true })
  nextBillingDate: Date;

  @Column({ default: false })
cancelAtPeriodEnd: boolean;


@OneToMany(() => SubscriptionChange, (change) => change.subscription)
changes: SubscriptionChange[];

@OneToMany(() => Payment, payment => payment.subscription)
payments: Payment[];

  // Relationships
  // @ManyToOne(() => Tenant, tenant => tenant.subscriptions)
  // @JoinColumn({ name: 'tenantId' })
  // subscriptionTenant: Tenant;
}
