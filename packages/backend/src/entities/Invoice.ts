import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Customer } from './Customer';
import { InvoiceItem } from './InvoiceItem';
import { PaymentInvoice } from './PaymentInvoice';
import { Subscription } from './Subscription';
import { GSTIN } from './GSTIN';
import { TaxDetail } from './TaxDetail';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  OPEN = 'open',
  PENDING = 'pending',
}

export enum InvoiceType {
  STANDARD = 'standard',
  PROFORMA = 'proforma',
  CREDIT = 'credit',
  DEBIT = 'debit'
}

export enum PaymentTerms {
  DUE_ON_RECEIPT = 'due_on_receipt',
  NET_7 = 'net_7',
  NET_15 = 'net_15',
  NET_30 = 'net_30',
  NET_60 = 'net_60'
}

@Entity('invoices')
@Index('IDX_INVOICES_TENANT_DELETED', ['tenantId', 'deletedAt'])
@Index('IDX_INVOICES_TENANT_STATUS_DELETED', ['tenantId', 'status', 'deletedAt'])
@Index('IDX_INVOICES_TENANT_CUSTOMER_DELETED', ['tenantId', 'customerId', 'deletedAt'])
@Index('IDX_INVOICES_TENANT_DUE_DATE_DELETED', ['tenantId', 'dueDate', 'deletedAt'])
@Index('IDX_INVOICES_TENANT_CREATED_ID', ['tenantId', 'createdAt', 'id'])
@Index('IDX_INVOICES_TENANT_NUMBER', ['tenantId', 'invoiceNumber'])
export class Invoice extends TenantAwareEntity {
  @Column()
  @Index('IDX_INVOICES_NUMBER')
  invoiceNumber: string;

  @Column({ type: 'enum', enum: InvoiceType, default: InvoiceType.STANDARD })
  type: InvoiceType;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  @Index('IDX_INVOICES_STATUS')
  status: InvoiceStatus;

  @Column()
  @Index('IDX_INVOICES_CUSTOMER')
  customerId: string;

  @ManyToOne(() => Customer, customer => customer.invoices)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ type: 'date' })
  @Index('IDX_INVOICES_ISSUE_DATE')
  issueDate: Date;

  @Column({ type: 'date' })
  @Index('IDX_INVOICES_DUE_DATE')
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  @Column({ type: 'enum', enum: PaymentTerms, default: PaymentTerms.NET_15 })
  paymentTerms: PaymentTerms;

  @Column({ type: 'text', nullable: true })
  shippingAddress: string;

  @Column({ type: 'text', nullable: true })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  termsAndConditions: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subTotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxTotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountTotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceDue: number;

  // REMOVED eager: true - fetch tax details only when needed
  @OneToMany(() => TaxDetail, taxDetail => taxDetail.invoice, { 
    cascade: true 
  })
  taxDetails: TaxDetail[];

  @Column({ type: 'jsonb', nullable: true })
  discountDetails: Array<{
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  }>;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ type: 'jsonb', nullable: true })
  recurringSettings: {
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    interval: number;
    startDate: Date;
    endDate?: Date;
    totalOccurrences?: number;
  };

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  viewedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  @Index('IDX_INVOICES_DELETED_AT')
  deletedAt: Date | null;

  // Relationships
  @ManyToOne(() => Tenant, tenant => tenant.invoices)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  // REMOVED eager: true - fetch items only when needed (detail views)
  @OneToMany(() => InvoiceItem, invoiceItem => invoiceItem.invoice, { 
    cascade: true 
  })
  items: InvoiceItem[];

  @OneToMany(() => PaymentInvoice, payment => payment.invoice)
  payments: PaymentInvoice[];

  @ManyToOne(() => GSTIN, (gstin) => gstin.invoices)
  @JoinColumn({ name: "gstinId" })
  gstin: GSTIN;

  @ManyToOne(() => Subscription, { nullable: true })
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
