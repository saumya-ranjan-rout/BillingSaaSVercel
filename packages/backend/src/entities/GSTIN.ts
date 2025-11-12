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
import { Invoice } from './Invoice';

@Entity('gstins')
export class GSTIN {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'gstin', nullable: false })
  gstin: string;

  @Column({ type: 'varchar', length: 255, name: 'legalname', nullable: false })
  legalName: string;

  @Column({ type: 'varchar', length: 255, name: 'tradename', nullable: false })
  tradeName: string;

  @Column({ type: 'jsonb', name: 'address', nullable: false })
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };

  @Column({ type: 'varchar', length: 10, name: 'statecode', nullable: false })
  stateCode: string;

  @Column({ type: 'boolean', name: 'isactive', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', name: 'isprimary', default: false })
  isPrimary: boolean;

  @Column({ type: 'jsonb', name: 'authstatus', nullable: true })
  authStatus?: {
    status: 'verified' | 'pending' | 'failed';
    verifiedAt?: Date;
  };

  @Column({ type: 'uuid', name: 'tenantId', nullable: false })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.gstins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  // @OneToMany(() => Invoice, (invoice) => invoice.gstins)
  // invoices: Invoice[];
  @OneToMany(() => Invoice, (invoice) => invoice.gstin)
invoices: Invoice[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
