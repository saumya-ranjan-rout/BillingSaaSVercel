import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToMany, 
  JoinTable  ,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Tenant } from './Tenant';
import { Notification } from './Notification';
import { SyncLog } from './SyncLog';
import { TenantAwareEntity } from './BaseEntity';
import { Role } from './Role';
import { ProfessionalUser } from './ProfessionalUser';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  FINANCE = 'finance',
  SALES = 'sales',
  SUPPORT = 'support',
  MEMBER = 'member',
  USER = 'user',
  PROFESSIONAL = 'professional', 
  SUPER_USER = 'super_user',
  PROFESSIONAL_USER = 'professional_user'
}

export enum UserStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  SUSPENDED = 'suspended',
}
@Entity('user')
//export class User {
export class User extends TenantAwareEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //   @Column()
  // name: string; // Add name field


  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  pushToken: string | null;

  // @Column({ type: 'varchar', length: 50, default: 'user' })
  // role: string;
    @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;


  @Column({ type: 'boolean', default: false })
  biometricEnabled: boolean;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string;
  
   @Column({ type: 'uuid', nullable: true })
  backupTenantId: string;

   @Column({ type: "timestamp", nullable: true })
  lastLoginAt?: Date;

  @ManyToOne(() => Tenant, tenant => tenant.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => SyncLog, syncLog => syncLog.user)
  syncLogs: SyncLog[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];


   @OneToMany(() => ProfessionalUser, (professional) => professional.user)
  professionals: ProfessionalUser[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
