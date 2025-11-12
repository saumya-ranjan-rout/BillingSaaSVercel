import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { SubscriptionPlan } from './SubscriptionPlan';
import { User } from './User';
import { Payment } from './Payment';
import { Tenant } from './Tenant';


export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TRIAL = 'trial'
}
export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity('subscriptions')
@Index(['tenantId', 'status'])
@Index(['userId', 'status'])
export class Subscription extends TenantAwareEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  planId: string;

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'boolean', default: false })
  autoRenew: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  stripeSubscriptionId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  razorpaySubscriptionId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => Payment, payment => payment.subscription)
  payments: Payment[];

   @ManyToOne(() => Tenant, (tenant) => tenant.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant; 
}
