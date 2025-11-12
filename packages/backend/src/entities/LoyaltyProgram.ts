import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';

export enum LoyaltyProgramStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused'
}

export enum RewardType {
  CASHBACK = 'cashback',
  POINTS = 'points',
  DISCOUNT = 'discount'
}

@Entity('loyalty_programs')
export class LoyaltyProgram extends TenantAwareEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: LoyaltyProgramStatus, default: LoyaltyProgramStatus.ACTIVE })
  status: LoyaltyProgramStatus;

  @Column({ type: 'enum', enum: RewardType, default: RewardType.CASHBACK })
  rewardType: RewardType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.0 }) // 5% default cashback
  cashbackPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 10000.0 }) // ₹10,000 threshold
  minimumPurchaseAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maximumCashbackAmount: number;

  @Column({ type: 'integer', nullable: true }) // Points per ₹100 spent
  pointsPerUnit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true }) // ₹ value per point
  pointValue: number;

  @Column({ type: 'jsonb', default: {} })
  eligibilityCriteria: {
    customerGroups?: string[];
    productCategories?: string[];
    minimumOrderValue?: number;
    excludedProducts?: string[];
  };

  @Column({ type: 'jsonb', default: {} })
  redemptionRules: {
    minimumPoints?: number;
    maximumRedemptionPerOrder?: number;
    validityPeriod?: number; // days
  };

  @Column({ default: true })
  isDefault: boolean;

  // Relationships
  @ManyToOne(() => Tenant, tenant => tenant.loyaltyPrograms)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;
}
