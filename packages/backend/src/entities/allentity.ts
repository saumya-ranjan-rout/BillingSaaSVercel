import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Tenant } from "./Tenant";
import { User } from "./User";
import { Product } from "./Product";
import { HsnCode } from "./HsnCode";
import { Invoice } from "./Invoice";

// ---------------------- CLIENT ----------------------
@Entity("client")
export class Client {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone?: string;

  @Column({ type: "text", nullable: true })
  address?: string;

  @Column({ length: 100, nullable: true })
  taxId?: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.clients, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}

// ---------------------- GSTINS ----------------------
@Entity("gstins")
export class GSTIN {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  gstin: string;

  @Column({ length: 255 })
  legalname: string;

  @Column({ length: 255 })
  tradename: string;

  @Column({ type: "jsonb" })
  address: any;

  @Column({ length: 10 })
  statecode: string;

  @Column({ default: true })
  isactive: boolean;

  @Column({ default: false })
  isprimary: boolean;

  @Column({ type: "jsonb", nullable: true })
  authstatus?: any;

  @ManyToOne(() => Tenant, (tenant) => tenant.gstins, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ---------------------- HSN CODES ----------------------
@Entity("hsn_codes")
export class HsnCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  code: string;

  @Column({ type: "text" })
  description: string;

  @Column("numeric", { precision: 5, scale: 2 })
  gstrate: number;

  @Column("numeric", { precision: 5, scale: 2, nullable: true })
  cessrate?: number;

  @Column({ default: true })
  isactive: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.hsnCodes)
  @JoinColumn({ name: "tenantid" })
  tenant: Tenant;

  @CreateDateColumn()
  createdat: Date;

  @UpdateDateColumn()
  updatedat: Date;
}

// ---------------------- PRODUCTS ----------------------
@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", default: "service" })
  type: string;

  @Column("numeric", { precision: 15, scale: 2 })
  price: number;

  @Column({ length: 10 })
  currency: string;

  @Column({ default: true })
  isactive: boolean;

  @Column({ length: 255, nullable: true })
  sku?: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: any;

  @ManyToOne(() => Tenant, (tenant) => tenant.products)
  @JoinColumn({ name: "tenantid" })
  tenant: Tenant;

  @ManyToOne(() => HsnCode, (hsn) => hsn.id)
  @JoinColumn({ name: "hsnid" })
  hsn: HsnCode;

  @CreateDateColumn()
  createdat: Date;

  @UpdateDateColumn()
  updatedat: Date;
}

// ---------------------- INVOICE ----------------------
@Entity("invoice")
export class Invoice {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ length: 255 })
  invoiceNumber: string;

  @Column({ length: 255 })
  clientName: string;

  @Column("numeric", { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "date" })
  dueDate: Date;

  @Column({ length: 50, default: "draft" })
  status: string;

  @Column({ type: "jsonb", nullable: true })
  items?: any;

  @ManyToOne(() => Tenant, (tenant) => tenant.invoices, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @OneToMany(() => InvoiceItem, (item) => item.invoice)
  invoiceItems: InvoiceItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ---------------------- INVOICE ITEMS ----------------------
@Entity("invoice_items")
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  description: string;

  @Column("numeric", { precision: 10, scale: 2 })
  quantity: number;

  @Column({ length: 50 })
  unit: string;

  @Column("numeric", { precision: 15, scale: 2 })
  unitprice: number;

  @Column("numeric", { precision: 15, scale: 2 })
  amount: number;

  @Column("numeric", { precision: 5, scale: 2 })
  taxrate: number;

  @Column("numeric", { precision: 15, scale: 2 })
  taxamount: number;

  @Column("numeric", { precision: 5, scale: 2, nullable: true })
  cessrate?: number;

  @Column("numeric", { precision: 15, scale: 2, default: 0 })
  cessamount: number;

  @Column({ type: "jsonb", nullable: true })
  metadata?: any;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "invoiceid" })
  invoice: Invoice;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productid" })
  product: Product;

  @ManyToOne(() => HsnCode, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hsnid" })
  hsn: HsnCode;

  @ManyToOne(() => Tenant, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantid" })
  tenant: Tenant;

  @CreateDateColumn()
  createdat: Date;

  @UpdateDateColumn()
  updatedat: Date;
}

// ---------------------- USER ----------------------
@Entity("user")
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ type: "text", nullable: true })
  pushToken?: string;

  @Column({ length: 50, default: "user" })
  role: string;

  @Column({ default: false })
  biometricEnabled: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ---------------------- NOTIFICATION ----------------------
@Entity("notification")
export class Notification {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: "text" })
  body: string;

  @Column({ type: "jsonb", nullable: true })
  data?: any;

  @Column({ default: false })
  isRead: boolean;

  @Column({ length: 100, nullable: true })
  type?: string;

  @Column({ length: 50, default: "normal" })
  priority: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}

// ---------------------- SUBSCRIPTIONS ----------------------
@Entity("subscriptions")
export class Subscription {
  @PrimaryColumn("uuid")
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.subscriptions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ default: "trialing" })
  status: string;

  @Column({ default: "monthly" })
  billingCycle: string;

  @Column("numeric", { precision: 10, scale: 2 })
  price: number;

  @Column({ type: "jsonb", default: [] })
  features: any;

  @Column({ default: 1 })
  userLimit: number;

  @Column({ default: 0 })
  invoiceLimit: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: "timestamptz", nullable: true })
  currentPeriodStart?: Date;

  @Column({ type: "timestamptz", nullable: true })
  currentPeriodEnd?: Date;

  @Column({ type: "timestamptz", nullable: true })
  cancelAt?: Date;

  @Column({ default: false })
  cancelAtPeriodEnd: boolean;

  @Column({ nullable: true })
  stripeSubscriptionId?: string;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ nullable: true })
  stripePriceId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ---------------------- SYNC LOG ----------------------
@Entity("syncLog")
export class SyncLog {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "jsonb" })
  results: any;

  @ManyToOne(() => Tenant, (tenant) => tenant.syncLogs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  timestamp: Date;
}
