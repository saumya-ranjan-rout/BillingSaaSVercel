import { Entity, Column, ManyToOne , JoinColumn} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Subscription } from './Subscription';
import { Plan } from './Plan';
import { User } from './User';

export enum ChangeType {
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
  SWITCH = 'switch',
}

export enum ChangeStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity('subscription_changes')
export class SubscriptionChange extends BaseEntity {
  
// @ManyToOne(() => Subscription, (subscription) => subscription.changes, { onDelete: 'CASCADE' })
// @JoinColumn({ name: 'subscription_id' })
// subscription: Subscription;


  @Column({name: 'subscription_id',type: 'uuid'})
  subscriptionId: string;

  @ManyToOne(() => Plan, { nullable: false })
@JoinColumn({ name: 'requested_plan_id' })   // 👈 force TypeORM to use your existing column
plan: Plan;


  @Column({name: 'requested_plan_id',type: 'uuid'})
  requested_plan_id: string;

@Column({
  type: 'enum',
  enum: ChangeType,
  default: ChangeType.SWITCH,  // 👈 pick a sensible default
})
change_type: ChangeType;

  @Column({
    type: 'enum',
    enum: ChangeStatus,
    default: ChangeStatus.PENDING,
  })
  status: ChangeStatus;

  @Column({ type: 'timestamptz', nullable: true })
  scheduled_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  effective_date: Date;

  @Column({ type: 'decimal', precision: 19, scale: 4, nullable: true })
prorated_amount: number | null;


  @Column({ type: 'text', nullable: true })
  notes: string;

//   @ManyToOne(() => User, { nullable: false })
//   requested_by: User;
@ManyToOne(() => User, { nullable: false })
@JoinColumn({ name: 'requested_by' })   // 👈 force it to use your column
requested_by: User;



  @Column({name: 'requested_by',type: 'uuid'})
  requested_by_user_id: string;

  @ManyToOne(() => User, { nullable: true })
  reviewed_by: User;

  @Column({ nullable: true })
  reviewed_by_user_id: string;

  @Column({ type: 'timestamptz', nullable: true })
  reviewed_at: Date;
}
