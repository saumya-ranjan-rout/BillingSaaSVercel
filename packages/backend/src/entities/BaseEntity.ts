import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { validateOrReject, ValidationError } from 'class-validator';
 
// export abstract class BaseEntity {
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
 
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
 



}

export abstract class TenantAwareEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId: string;
}


  // @BeforeInsert()
  // @BeforeUpdate()
  // async validate() {
  //   try {
  //     await validateOrReject(this);
  //   } catch (errors) {
  //     if (Array.isArray(errors) && errors.every(error => error instanceof ValidationError)) {
  //       const message = errors
  //         .map(error => Object.values(error.constraints || {}).join(', '))
  //         .join('; ');
  //       throw new Error(`Validation failed: ${message}`);
  //     }
  //     throw errors;
  //   }
  // }