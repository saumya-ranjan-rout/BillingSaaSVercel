import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Permission } from './Permission';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({name: 'name',type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  is_system_role: boolean;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
