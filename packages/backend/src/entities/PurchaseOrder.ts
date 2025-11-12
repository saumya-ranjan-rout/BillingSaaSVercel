import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Vendor } from './Vendor';
import { PurchaseItem } from './PurchaseItem';

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  ORDERED = 'ordered',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
  PAID = 'paid'
}

export enum PurchaseOrderType {
  PRODUCT = 'product',
  SERVICE = 'service',
  EXPENSE = 'expense'
}

@Entity('purchase_orders')
export class PurchaseOrder extends TenantAwareEntity {
  @Column()
  poNumber: string;

  @Column({ type: 'enum', enum: PurchaseOrderStatus, default: PurchaseOrderStatus.DRAFT })
  status: PurchaseOrderStatus;

  @Column({ type: 'enum', enum: PurchaseOrderType, default: PurchaseOrderType.PRODUCT })
  type: PurchaseOrderType;

  @Column()
  vendorId: string;

  @ManyToOne(() => Vendor, vendor => vendor.purchaseOrders)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column({ type: 'date' })
  orderDate: Date;

  @Column({ type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDeliveryDate: Date;

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

  @Column({ type: 'jsonb', nullable: true })
  taxDetails: Array<{
    taxName: string;
    taxRate: number;
    taxAmount: number;
  }>;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  // Relationships
  @ManyToOne(() => Tenant, tenant => tenant.purchaseOrders)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => PurchaseItem, purchaseItem => purchaseItem.purchaseOrder, {
    cascade: true,
    eager: true
  })
  items: PurchaseItem[];
}
