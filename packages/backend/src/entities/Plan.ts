import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Subscription } from './Subscription';
import { PlanFeature } from './PlanFeature';

export enum BillingInterval {
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

@Entity('plans')
export class Plan extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

//   @Column({name: 'code',  type: 'varchar', length: 100}) //unique: true 
//   code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price_amount: number;

  @Column({ length: 3, default: 'USD' })
  price_currency: string;

@Column({
  type: 'enum',
  enum: BillingInterval,
  default: BillingInterval.MONTH, // 👈 provide a default
})
billing_interval: BillingInterval

  @Column({ default: 0 })
  trial_period_days: number;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  @OneToMany(() => PlanFeature, (feature) => feature.plan)
  features: PlanFeature[];
}
