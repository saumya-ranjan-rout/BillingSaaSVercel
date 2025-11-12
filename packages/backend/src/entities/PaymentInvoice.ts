import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Invoice } from './Invoice';
import { Customer } from './Customer';
import { Vendor } from './Vendor';

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  UPI = 'upi',
  WALLET = 'wallet',
  OTHER = 'other'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}
export enum PaymentType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

@Entity('payments_invoice')
export class PaymentInvoice extends TenantAwareEntity {
  @Column()
  invoiceId: string;

  @ManyToOne(() => Invoice, invoice => invoice.payments)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column()
  customerId: string;

  @ManyToOne(() => Customer, customer => customer.payments)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.BANK_TRANSFER })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;
  
  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.EXPENSE })
  paymentType: PaymentType;

  @Column({ type: 'date' })
  paymentDate: Date;

  // Add paymentType field
  // @Column({
  //   type: 'enum',
  //   enum: PaymentType,
  //   default: PaymentType.EXPENSE
  // })
  // paymentType: PaymentType;


  @Column({ nullable: true })
  referenceNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  paymentDetails: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  // Relationships
  @ManyToOne(() => Tenant, tenant => tenant.payments)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;
  @ManyToOne(() => Vendor, vendor => vendor.payments, { nullable: true })
vendor?: Vendor;
}
