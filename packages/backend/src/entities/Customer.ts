import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Invoice } from './Invoice';
import { User } from './User';
import { PaymentInvoice } from './PaymentInvoice';
import { LoyaltyTransaction } from "./LoyaltyTransaction";
import { CustomerLoyalty } from "./CustomerLoyalty";

export enum CustomerType {
  BUSINESS = 'business',
  INDIVIDUAL = 'individual',
}

@Entity('customers')
export class Customer extends TenantAwareEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: CustomerType, default: CustomerType.BUSINESS })
  type: CustomerType;

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
    pincode: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };

  //   @Column({ default: 'India' })
  // country: string;

  @Column({ nullable: true })
  status: string;

  // @Column({ nullable: true })
  // requestedBy: string;

  //   @Column({ nullable: true })
  // requestedTo: string;
  
    @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'requestedBy' })
  requestedBy: User;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'requestedTo' })
  requestedTo: User;

  @Column({ nullable: true })
  gstin: string;

  @Column({ nullable: true })
  pan: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditBalance: number;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  // Relationships
  @ManyToOne(() => Tenant, tenant => tenant.users)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

  @OneToMany(() => PaymentInvoice, (payment) => payment.customer)
payments: PaymentInvoice[];

  @OneToMany(() => LoyaltyTransaction, transaction => transaction.customer)
  loyaltyTransactions: LoyaltyTransaction[];

    @OneToMany(() => CustomerLoyalty, loyalty => loyalty.customer)
  loyaltyData: CustomerLoyalty[];

    // ✅ Add these virtual fields (NO decorator)

  checkSubscription?: "active" | "inactive";
}
















// import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { TenantAwareEntity } from './BaseEntity';
// import { Tenant } from './Tenant';
// import { Invoice } from './Invoice';

// export enum CustomerType {
//   BUSINESS = 'business',
//   INDIVIDUAL = 'individual',
// }

// @Entity('customers')
// export class Customer extends TenantAwareEntity {
//   @Column()
//   name: string;

//   @Column({ type: 'enum', enum: CustomerType, default: CustomerType.BUSINESS })
//   type: CustomerType;

//   @Column({ nullable: true })
//   email: string;

//   @Column({ nullable: true })
//   phone: string;

//   @Column({ type: 'jsonb', nullable: true })
//   billingAddress: {
//     line1: string;
//     line2?: string;
//     city: string;
//     state: string;
//     country: string;
//     pincode: string;
//   };

//   @Column({ type: 'jsonb', nullable: true })
//   shippingAddress: {
//     line1: string;
//     line2?: string;
//     city: string;
//     state: string;
//     country: string;
//     pincode: string;
//   };

//   @Column({ nullable: true })
//   gstin: string;

//   @Column({ nullable: true })
//   pan: string;

//   @Column({ default: true })
//   isActive: boolean;

//   @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
//   creditBalance: number;

//   @Column({ type: 'jsonb', default: {} })
//   metadata: Record<string, any>;

//   // Relationships
//   @ManyToOne(() => Tenant, tenant => tenant.users)
//   @JoinColumn({ name: 'tenantId' })
//   tenant: Tenant;

//     @OneToMany(() => Invoice, (invoice) => invoice.customer)
//     invoices: Invoice[];
// }
