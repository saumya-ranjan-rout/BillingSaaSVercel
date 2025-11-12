import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { PurchaseOrder } from './PurchaseOrder';
import { Product } from './Product';

@Entity('purchase_items')
export class PurchaseItem extends TenantAwareEntity {
  @Column()
  purchaseOrderId: string;

  @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.items, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  receivedQuantity: number;

  @Column({ default: false })
  isReceived: boolean;
}
