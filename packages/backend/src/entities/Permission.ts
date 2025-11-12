import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({name: 'code',type: 'varchar', length: 100 })
  code: string;

  @Column({name: 'name',type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({name: 'category',type: 'varchar', length: 100 })
  category: string;
}
