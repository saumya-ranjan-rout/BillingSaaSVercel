import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Invoice } from './Invoice';
import { Product } from './Product';
import { HSN } from './HSN';

@Entity('invoice_items')
export class InvoiceItem extends TenantAwareEntity {
  @Column()
  invoiceId: string;

  @ManyToOne(() => Invoice, invoice => invoice.items, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column({ nullable: true })
  productId: string;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  lineTotal: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => HSN, (hsn) => hsn.invoiceItems)
@JoinColumn({ name: "hsnId" })
hsn: HSN;

}
