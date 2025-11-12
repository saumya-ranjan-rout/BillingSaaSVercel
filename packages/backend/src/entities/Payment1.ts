import { Entity, Column, ManyToOne, JoinColumn,DeleteDateColumn } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Subscription } from './Subscription';
import { Tenant } from './Tenant';
import { ProfessionalUser } from './ProfessionalUser';


export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CARD = 'card',
  NETBANKING = 'netbanking',
  UPI = 'upi',
  WALLET = 'wallet',
  BANK_TRANSFER = 'bank_transfer'
}

@Entity('payments')
export class Payment extends TenantAwareEntity {
  @Column()
  subscriptionId: string;

  @ManyToOne(() => Subscription, subscription => subscription.payments)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'timestamp' })
  paymentDate: Date;

  @Column({ nullable: true })
  gatewayPaymentId: string;

  @Column({ nullable: true })
  gatewayOrderId: string;

  @Column({ type: 'jsonb', nullable: true })
  gatewayResponse: Record<string, any>;

  @Column({ nullable: true })
  invoiceId: string;

  @Column({ nullable: true })
  receipt: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  refundDetails: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;
  // in Payment.ts
@DeleteDateColumn({ nullable: true })
deletedAt?: Date;



}
