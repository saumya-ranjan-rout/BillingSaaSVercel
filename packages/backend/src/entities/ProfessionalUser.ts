import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Tenant } from './Tenant';
import { BaseEntity } from './BaseEntity';

export enum ProfessionalType {
  CA = 'ca',
  ACCOUNTANT = 'accountant',
  CONSULTANT = 'consultant',
  OTHER = 'other',
}

@Entity('professional_user')
export class ProfessionalUser extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

@ManyToOne(() => User, (user) => user.professionals, { onDelete: 'CASCADE' })
user: User;

  @Column({ type: 'enum', enum: ProfessionalType })
  professionalType: ProfessionalType;

  @Column({ nullable: true })
  firmName?: string;

  @Column({ nullable: true })
  professionalLicenseNumber?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // ✅ Correct relationship name
  @ManyToMany(() => Tenant, (tenant) => tenant.professionals)
  @JoinTable({
  name: 'professional_tenants',
  joinColumn: { name: 'professionalId', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'tenantId', referencedColumnName: 'id' },
})
  managedTenants: Tenant[];

  @Column({ type: 'jsonb', nullable: true })
  permissions: any;
}
