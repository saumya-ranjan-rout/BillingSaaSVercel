import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { User } from './User';
import { Invoice } from './Invoice';
import { Subscription } from './Subscription';
import { GSTIN } from './GSTIN';
import { SyncLog } from './SyncLog';
import { Client } from './Client';
import { Product } from './Product';
import { HSN } from './HSN';
import { BaseEntity } from './BaseEntity';
import { TaxRate } from './TaxRate';
import { ProfessionalUser } from './ProfessionalUser';
import { PurchaseOrder } from './PurchaseOrder';
import { Vendor } from './Vendor';
import { Category } from './Category';
import { PaymentInvoice } from './PaymentInvoice';
import { Report } from './Report';
import { Expense } from './Expense';
import { LoyaltyProgram } from './LoyaltyProgram';

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  TRIAL_EXPIRED = 'trial_expired',
}

@Entity('tenant')
export class Tenant extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  businessName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subdomain?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string;

  @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.TRIAL })
  status: TenantStatus;

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // New fields
  @Column({ type: 'varchar', length: 255, nullable: true })
  accountType?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  professionType?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  licenseNo?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pan?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  gst?: string;

  // Relationships
  @OneToMany(() => User, user => user.tenant)
  users: User[];

  @OneToMany(() => Invoice, invoice => invoice.tenant)
  invoices: Invoice[];

  @OneToMany(() => Subscription, subscription => subscription.tenant)
  subscriptions: Subscription[];

  @OneToMany(() => GSTIN, gstin => gstin.tenant)
  gstins: GSTIN[];

  @OneToMany(() => Client, client => client.tenant)
  clients: Client[];

  @OneToMany(() => SyncLog, syncLog => syncLog.tenant)
  syncLogs: SyncLog[];

  @OneToMany(() => Category, category => category.tenant)
  categories: Category[];

  @OneToMany(() => Product, product => product.tenant)
  products: Product[];

  @OneToMany(() => HSN, hsn => hsn.tenant)
  hsnCodes: HSN[];

  @OneToMany(() => TaxRate, taxRate => taxRate.tenant)
  taxRates: TaxRate[];

  @ManyToMany(() => ProfessionalUser, professional => professional.managedTenants)
  professionals: ProfessionalUser[];

  @OneToMany(() => PurchaseOrder, po => po.tenant)
  purchaseOrders: PurchaseOrder[];

  @OneToMany(() => Vendor, vendor => vendor.tenant)
  vendors: Vendor[];

  @OneToMany(() => PaymentInvoice, payment => payment.tenant)
  payments: PaymentInvoice[];

  @OneToMany(() => Report, report => report.tenant)
  reports: Report[];

  @OneToMany(() => Expense, expense => expense.tenant)
  expenses: Expense[];

  @OneToMany(() => LoyaltyProgram, loyaltyProgram => loyaltyProgram.tenant)
  loyaltyPrograms: LoyaltyProgram[];
}


// import { Entity, Column, OneToMany, Index ,ManyToMany , JoinTable } from 'typeorm';
// import { User } from './User';
// import { Invoice } from './Invoice';
// import { Subscription } from './Subscription';
// import { GSTIN } from './GSTIN';
// import { SyncLog } from './SyncLog';
// import { Client } from './Client';
// import { Product } from './Product';
// import { HSN } from './HSN';
// import { BaseEntity } from './BaseEntity';
// import { TaxRate } from './TaxRate'; // add this import
// import { ProfessionalUser } from './ProfessionalUser'; // Add this import
// import { PurchaseOrder } from './PurchaseOrder';
// import { Vendor } from './Vendor';
// import { Category } from './Category';
// import { PaymentInvoice } from './PaymentInvoice';
// import { Report } from './Report';
// import { Expense } from './Expense';
// import { LoyaltyProgram } from './LoyaltyProgram';

// // Inside Tenant entity class:

 
// export enum TenantStatus {
//   ACTIVE = 'active',
//   SUSPENDED = 'suspended',
//   TRIAL = 'trial',
//   TRIAL_EXPIRED = 'trial_expired',
// }
 
// @Entity('tenant')
// export class Tenant extends BaseEntity { // Extend BaseEntity
//   @Column({ type: 'varchar', length: 255, nullable: false })
//   name: string;
 
//   @Column({ type: 'varchar', length: 255, nullable: true })
//   businessName: string;
 
//   // @Index({ unique: true })
//   @Column({ type: 'varchar', length: 255, nullable: true  })
//  subdomain?: string | null;


 
//   // Add the missing slug property


// // @Index({ unique: true })
// @Column({ type: 'varchar', length: 255, nullable: true }) // Change to nullable: true
// slug: string;
 
//   @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.TRIAL })
//   status: TenantStatus;
 
//   @Column({ type: 'timestamp', nullable: true })
//   trialEndsAt: Date;
 
//   @Column({ nullable: true })
//   stripeCustomerId: string;
 
//   @Column({ type: 'boolean', default: true })
//   isActive: boolean;
 
//   // Relationships
//   @OneToMany(() => User, user => user.tenant)
//   users: User[];
 
//   @OneToMany(() => Invoice, invoice => invoice.tenant)
//   invoices: Invoice[];
 
//   @OneToMany(() => Subscription, subscription => subscription.tenant)
//   subscriptions: Subscription[];
 
//   @OneToMany(() => GSTIN, gstin => gstin.tenant)
//   gstins: GSTIN[];
 
//   @OneToMany(() => Client, client => client.tenant)
//   clients: Client[];
 
//   @OneToMany(() => SyncLog, syncLog => syncLog.tenant)
//   syncLogs: SyncLog[];

//    @OneToMany(() => Category, (category) => category.tenant)
//   categories: Category[];

//   @OneToMany(() => Product, product => product.tenant)
//   products: Product[];
 
//   @OneToMany(() => HSN, hsn => hsn.tenant)
//   hsnCodes: HSN[];
 
//   @OneToMany(() => TaxRate, taxRate => taxRate.tenant)
// taxRates: TaxRate[];
//   // No need to redefine id, createdAt, updatedAt as they're inherited from BaseEntity
//   // No need to define validate() as it's inherited from BaseEntity
// @ManyToMany(() => ProfessionalUser, (professional) => professional.managedTenants)
// professionals: ProfessionalUser[];

// @OneToMany(() => PurchaseOrder, (po) => po.tenant)
// purchaseOrders: PurchaseOrder[];

// @OneToMany(() => Vendor, (vendor) => vendor.tenant)
// vendors: Vendor[];

// @OneToMany(() => PaymentInvoice, (payment) => payment.tenant)
// payments: PaymentInvoice[];


//   @OneToMany(() => Report, report => report.tenant)
//   reports: Report[];

//   @OneToMany(() => Expense, expense => expense.tenant)
// expenses: Expense[];

//   @OneToMany(() => LoyaltyProgram, loyaltyProgram => loyaltyProgram.tenant)
//   loyaltyPrograms: LoyaltyProgram[];



// }