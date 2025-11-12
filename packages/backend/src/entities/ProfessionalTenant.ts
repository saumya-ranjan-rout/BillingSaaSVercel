import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { ProfessionalUser } from './ProfessionalUser';
import { Tenant } from './Tenant';

@Entity('professional_tenants')
export class ProfessionalTenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProfessionalUser, professional => professional.managedTenants)
  professional: ProfessionalUser;

  @Column()
  professionalId: string;

  @ManyToOne(() => Tenant, tenant => tenant.professionals)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ type: 'jsonb', nullable: true })
  specificPermissions: {
    canFileGST: boolean;
    canManagePurchases: boolean;
    canApproveExpenses: boolean;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  assignedAt: Date;
}
