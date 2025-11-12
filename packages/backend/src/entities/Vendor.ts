import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { PurchaseOrder } from './PurchaseOrder';
import { PaymentInvoice } from './PaymentInvoice';

export enum VendorType {
  SUPPLIER = 'supplier',
  SERVICE_PROVIDER = 'service_provider',
  CONTRACTOR = 'contractor',
}

@Entity('vendors')
export class Vendor extends TenantAwareEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: VendorType, default: VendorType.SUPPLIER })
  type: VendorType;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'jsonb', nullable: true })
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  @Column({ nullable: true })
  gstin: string;

  @Column({ nullable: true })
  pan: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  outstandingBalance: number;

  @Column({ type: 'text', nullable: true })
  paymentTerms: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  // Relationships
  @ManyToOne(() => Tenant, tenant => tenant.vendors)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.vendor)
  purchaseOrders: PurchaseOrder[];

  @OneToMany(() => PaymentInvoice, payment => payment.vendor)
payments: PaymentInvoice[];
}
