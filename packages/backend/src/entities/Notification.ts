import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  type: string | null; // e.g., invoice_due, payment_received

  @Column({ type: 'varchar', length: 50, default: 'normal' })
  priority: string; // low, normal, high

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, user => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
