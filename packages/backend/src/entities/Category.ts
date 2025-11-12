import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Product } from './Product';

@Entity('categories')
export class Category extends TenantAwareEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => Category, category => category.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  // Relationships
  @ManyToOne(() => Tenant, tenant => tenant.categories)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
