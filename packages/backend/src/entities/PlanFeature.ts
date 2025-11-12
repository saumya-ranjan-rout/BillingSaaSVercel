import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Plan } from './Plan';

@Entity('plan_features')
export class PlanFeature extends BaseEntity {
  @ManyToOne(() => Plan, (plan) => plan.features, { onDelete: 'CASCADE' })
  plan: Plan;

  @Column({name: 'plan_id',type: 'uuid'})
  planId: string;

  @Column({name: 'code',type: 'varchar', length: 100 })
  code: string;

  @Column({name: 'name',type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ default: 0 })
  sort_order: number;
}
