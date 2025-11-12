import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Category } from './Category';
import { PurchaseItem } from './PurchaseItem';
import { InvoiceItem } from './InvoiceItem';
import {HSN} from './HSN';
import { TaxRate } from './TaxRate';

export enum ProductType {
  GOODS = 'goods',
  SERVICE = 'service',
  DIGITAL = 'digital'
}

export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

@Entity('products')
export class Product extends TenantAwareEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.GOODS })
  type: ProductType;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  hsnCode: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  costPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  sellingPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stockQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lowStockThreshold: number;

  @Column({ type: 'enum', enum: StockStatus, default: StockStatus.IN_STOCK })
  stockStatus: StockStatus;

  @Column({ nullable: true })
  unit: string;

  @OneToMany(() => TaxRate, (taxRate) => taxRate.product, { cascade: true })
taxRates: TaxRate[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, category => category.products, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  // Relationships
  @ManyToOne(() => Tenant, tenant => tenant.products)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => PurchaseItem, purchaseItem => purchaseItem.product)
  purchaseItems: PurchaseItem[];

  @OneToMany(() => InvoiceItem, invoiceItem => invoiceItem.product)
  invoiceItems: InvoiceItem[];

  @ManyToOne(() => HSN, (hsn) => hsn.products, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'hsnId' })
hsn: HSN;

@Column({ nullable: true })
hsnId: string;


}
