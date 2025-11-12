import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { TenantAwareEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";

@Entity("settings")
export class Setting extends TenantAwareEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tenantId: string;  // ✅ add this

  @ManyToOne(() => Tenant, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  subdomain: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  gstNumber: string;
}
