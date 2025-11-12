import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Subscription } from './Subscription';
import { User } from './User';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  CASHFREE = 'cashfree',
  MANUAL = 'manual'
}

@Entity('payments')
@Index(['tenantId', 'status'])
@Index(['userId', 'createdAt'])
export class Payment extends TenantAwareEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  subscriptionId: string;

  @ManyToOne(() => Subscription, { nullable: true })
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentGateway, default: PaymentGateway.RAZORPAY })
  gateway: PaymentGateway;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gatewayPaymentId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gatewayOrderId: string;

  @Column({ type: 'jsonb', nullable: true })
  gatewayResponse: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;
}
