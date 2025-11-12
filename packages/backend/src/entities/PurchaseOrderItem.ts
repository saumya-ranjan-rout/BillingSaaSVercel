import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PurchaseOrder } from './PurchaseOrder';

@Entity()
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PurchaseOrder, po => po.items, { onDelete: 'CASCADE' })
  purchaseOrder: PurchaseOrder;

  @Column()
  purchaseOrderId: string;

  @Column()
  itemName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  taxRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
}
