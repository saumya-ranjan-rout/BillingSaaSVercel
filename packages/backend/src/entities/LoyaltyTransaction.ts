import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Customer } from './Customer';
import { Invoice } from './Invoice';
import { LoyaltyProgram } from './LoyaltyProgram';

export enum TransactionType {
  EARN = 'earn',
  REDEEM = 'redeem',
  EXPIRY = 'expiry',
  ADJUSTMENT = 'adjustment'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

@Entity('loyalty_transactions')
export class LoyaltyTransaction extends TenantAwareEntity {
  @Column()
  customerId: string;

  @ManyToOne(() => Customer, customer => customer.loyaltyTransactions)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ nullable: true })
  invoiceId: string;

  @ManyToOne(() => Invoice, { nullable: true })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column({ nullable: true })
  programId: string;

  @ManyToOne(() => LoyaltyProgram, { nullable: true })
  @JoinColumn({ name: 'programId' })
  program: LoyaltyProgram;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: 'integer', default: 0 })
  points: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cashbackAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  orderAmount: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  effectivePercentage: number;
}
