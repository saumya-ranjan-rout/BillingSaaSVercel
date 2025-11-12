import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { BaseEntity } from './BaseEntity';

@Entity()
export class SuperAdmin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

 @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', default: {} })
  permissions: {
    canManageUsers: boolean;
    canManageTenants: boolean;
    canManageProfessionals: boolean;
    canViewAnalytics: boolean;
    canManageSystemSettings: boolean;
    canAccessAuditLogs: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
@JoinColumn({ name: 'userId' })
user: User;

  // Virtual field (not stored in database)
  //user?: User;
}

