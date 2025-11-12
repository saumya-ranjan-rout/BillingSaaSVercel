
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { BaseEntity } from '../entities/BaseEntity';
import { BadRequestError, NotFoundError } from '../utils/errors';

export abstract class BaseService<T extends BaseEntity> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findById(id: string, relations: string[] = []): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
      relations,
    });

    if (!entity) {
      throw new NotFoundError(`${this.repository.metadata.name} not found`);
    }

    return entity;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as T);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const entity = await this.findById(id);
    Object.assign(entity, data);
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.remove(entity);
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({ where });
    return count > 0;
  }
}

export abstract class TenantAwareService<T extends BaseEntity> extends BaseService<T> {
  constructor(repository: Repository<T>) {
    super(repository);
  }

  async findAllByTenant(tenantId: string, options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find({
      where: { tenantId } as unknown as FindOptionsWhere<T>,
      ...options,
    });
  }

  async findByIdAndTenant(id: string, tenantId: string, relations: string[] = []): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id, tenantId } as unknown as FindOptionsWhere<T>,
      relations,
    });

    if (!entity) {
      throw new NotFoundError(`${this.repository.metadata.name} not found`);
    }

    return entity;
  }
}















// import { Repository, FindOptionsWhere, DeepPartial, ObjectId } from 'typeorm';
// import { AppDataSource } from '../config/database';
// import { BaseEntity } from '../entities/BaseEntity';
// import { NotFoundError } from '../utils/errors';
 
// export class BaseService<T extends BaseEntity> {
//   protected repository: Repository<T>;
 
//   constructor(entity: new () => T) {
//     this.repository = AppDataSource.getRepository(entity);
//   }
 
//   async create(data: DeepPartial<T>): Promise<T> {
//     const entity = this.repository.create(data);
//     await this.repository.save(entity as any);
//     return entity;
//   }
 
//   async findOneById(id: string): Promise<T | null> {
//     return this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
//   }
 
//   async findOne(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null> {
//     return this.repository.findOne({ where });
//   }
 
//   async find(where?: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]> {
//     return this.repository.find({ where });
//   }
 
//   async update(id: string, data: DeepPartial<T>): Promise<T> {
//     const entity = await this.findOneById(id);
    
//     if (!entity) {
//       throw new NotFoundError('Entity not found');
//     }
 
//     this.repository.merge(entity as any, data);
//     await this.repository.save(entity as any);
//     return entity;
//   }
 
//   async delete(id: string): Promise<void> {
//     const result = await this.repository.delete(id);
    
//     if (result.affected === 0) {
//       throw new NotFoundError('Entity not found');
//     }
//   }
 
//   async count(where?: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<number> {
//     return this.repository.count({ where });
//   }
 
//   async exists(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<boolean> {
//     const count = await this.repository.count({ where });
//     return count > 0;
//   }
 
//   async paginate(
//     page: number = 1,
//     limit: number = 10,
//     where?: FindOptionsWhere<T> | FindOptionsWhere<T>[]
//   ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> {
//     const skip = (page - 1) * limit;
//     const [data, total] = await this.repository.findAndCount({
//       where,
//       skip,
//       take: limit,
//     });
 
//     return {
//       data,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }
// }






















// // import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
// // import { BaseEntity } from '../entities/BaseEntity';
// // import { AppDataSource } from '../../config/database';
// // import { BadRequestError, NotFoundError } from '../utils/errors';

// // export abstract class BaseService<T extends BaseEntity> {
// //   protected repository: Repository<T>;

// //   constructor(repository: Repository<T>) {
// //     this.repository = repository;
// //   }

// //   async findById(id: string, relations: string[] = []): Promise<T> {
// //     const entity = await this.repository.findOne({
// //       where: { id } as FindOptionsWhere<T>,
// //       relations,
// //     });

// //     if (!entity) {
// //       throw new NotFoundError(`${this.repository.metadata.name} not found`);
// //     }

// //     return entity;
// //   }

// //   async findAll(options?: FindManyOptions<T>): Promise<T[]> {
// //     return this.repository.find(options);
// //   }

// //   async create(data: Partial<T>): Promise<T> {
// //     const entity = this.repository.create(data as T);
// //     return this.repository.save(entity);
// //   }

// //   async update(id: string, data: Partial<T>): Promise<T> {
// //     const entity = await this.findById(id);
// //     Object.assign(entity, data);
// //     return this.repository.save(entity);
// //   }

// //   async delete(id: string): Promise<void> {
// //     const entity = await this.findById(id);
// //     await this.repository.remove(entity);
// //   }

// //   async exists(where: FindOptionsWhere<T>): Promise<boolean> {
// //     const count = await this.repository.count({ where });
// //     return count > 0;
// //   }
// // }

// // export abstract class TenantAwareService<T extends BaseEntity> extends BaseService<T> {
// //   constructor(repository: Repository<T>) {
// //     super(repository);
// //   }

// //   async findAllByTenant(tenantId: string, options?: FindManyOptions<T>): Promise<T[]> {
// //     return this.repository.find({
// //       where: { tenantId } as FindOptionsWhere<T>,
// //       ...options,
// //     });
// //   }

// //   async findByIdAndTenant(id: string, tenantId: string, relations: string[] = []): Promise<T> {
// //     const entity = await this.repository.findOne({
// //       where: { id, tenantId } as FindOptionsWhere<T>,
// //       relations,
// //     });

// //     if (!entity) {
// //       throw new NotFoundError(`${this.repository.metadata.name} not found`);
// //     }

// //     return entity;
// //   }
// // }
