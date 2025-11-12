import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from './Tenant';
import { SubscriptionPlan } from './SubscriptionPlan';
import { ProfessionalUser } from './ProfessionalUser';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TRIAL = 'trial'
}

@Entity()
export class TenantSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, tenant => tenant.subscriptions)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @ManyToOne(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @Column()
  planId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING
  })
  status: SubscriptionStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'date', nullable: true })
  trialEndDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: false })
  isPaidByProfessional: boolean;

  @ManyToOne(() => ProfessionalUser, { nullable: true })
  paidByProfessional: ProfessionalUser;

  @Column({ nullable: true })
  paidByProfessionalId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
