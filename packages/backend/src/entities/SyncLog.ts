import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from './Tenant';
import { User } from './User';

@Entity('syncLog')
export class SyncLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: false })
  results: any;

  @Index('idx_sync_log_tenant')
  @Column({ type: 'uuid', nullable: true })
  tenantId: string;

  @Index('idx_sync_log_user')
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => Tenant, tenant => tenant.syncLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => User, user => user.syncLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
