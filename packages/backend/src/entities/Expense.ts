import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Tenant } from './Tenant';

export enum ExpenseCategory {
  OFFICE_SUPPLIES = 'office_supplies',
  TRAVEL = 'travel',
  UTILITIES = 'utilities',
  SALARY = 'salary',
  MARKETING = 'marketing',
  SOFTWARE = 'software',
  HARDWARE = 'hardware',
  RENT = 'rent',
  MAINTENANCE = 'maintenance',
  OTHER = 'other'
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  CARD = 'card',
  ONLINE = 'online'
}

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ExpenseCategory,
    default: ExpenseCategory.OTHER
  })
  category: ExpenseCategory;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH
  })
  paymentMethod: PaymentMethod;

  @Column()
  expenseDate: Date;

  @Column({ nullable: true })
  referenceNumber: string;

  @Column({ nullable: true })
  vendor: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @ManyToOne(() => Tenant, tenant => tenant.expenses)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
