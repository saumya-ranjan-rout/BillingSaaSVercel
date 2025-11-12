import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from './Tenant';
import { Product } from './Product';
import { InvoiceItem } from './InvoiceItem';

@Entity('hsn_codes')
export class HSN {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'code', nullable: false })
  code: string;

  @Column({ type: 'text', name: 'description', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'gstrate', nullable: false })
  gstRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'cessrate', nullable: true })
  cessRate?: number;

  @Column({ type: 'boolean', name: 'isactive', default: true })
  isActive: boolean;

  @Column({ type: 'uuid', name: 'tenantid', nullable: false })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.hsnCodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantid' })
  tenant: Tenant;

  @OneToMany(() => Product, (product) => product.hsn)
  products: Product[];

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.hsn)
  invoiceItems: InvoiceItem[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdat',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updatedat',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
