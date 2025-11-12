import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Customer } from './Customer';
import { LoyaltyProgram } from './LoyaltyProgram';


export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

@Entity('customer_loyalty')
export class CustomerLoyalty extends TenantAwareEntity {
  @Column()
  customerId: string;

  @ManyToOne(() => Customer, customer => customer.loyaltyData)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ nullable: true })
  programId: string;

  @ManyToOne(() => LoyaltyProgram, { nullable: true })
  @JoinColumn({ name: 'programId' })
  program: LoyaltyProgram;

  @Column({ type: 'integer', default: 0 })
  totalPoints: number;

  @Column({ type: 'integer', default: 0 })
  availablePoints: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCashbackEarned: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  availableCashback: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmountSpent: number;

  @Column({ type: 'integer', default: 0 })
  totalOrders: number;

  @Column({ type: 'enum', enum: LoyaltyTier, default: LoyaltyTier.BRONZE })
  currentTier: LoyaltyTier;

  @Column({ type: 'timestamp', nullable: true })
  tierExpiryDate: Date;

  @Column({ type: 'jsonb', default: {} })
  tierBenefits: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityDate: Date;

  @Column({ type: 'jsonb', default: {} })
  statistics: {
    averageOrderValue: number;
    lastOrderAmount: number;
    redemptionRate: number;
  };
}
