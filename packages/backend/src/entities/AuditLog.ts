import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { SuperAdmin } from './SuperAdmin';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export'
}

export enum AuditResource {
  USER = 'user',
  TENANT = 'tenant',
  PROFESSIONAL = 'professional',
  SUBSCRIPTION = 'subscription',
  SYSTEM = 'system'
}

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SuperAdmin, { nullable: true })
  performedBy: SuperAdmin;
  
  @Column( { nullable: true })
tenantId: string;

  @Column({ nullable: true })
  performedById: string;

  @Column({
    type: 'enum',
    enum: AuditAction
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditResource
  })
  resource: AuditResource;

  @Column({ nullable: true })
  resourceId: string;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  timestamp: Date;
}
