import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './Tenant';
import { Product } from './Product';

@Entity()
export class TaxRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  rate: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Tenant, tenant => tenant.taxRates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

@ManyToOne(() => Product, product => product.taxRates, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'productId' })
product: Product;

@Column({ nullable: true })
productId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
