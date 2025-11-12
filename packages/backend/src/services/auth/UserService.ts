import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../../entities/User';
import { AppDataSource } from '../../config/database';
import { TenantAwareService } from '../BaseService';
import { BadRequestError } from '../../utils/errors';

export class UserService extends TenantAwareService<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }

  async createUser(data: Partial<User>): Promise<User> {
    // Check if user already exists in this tenant
    const where: any = { email: data.email };
if (data.tenantId) {
  where.tenantId = data.tenantId;
}
    const existingUser = await this.repository.findOne({where 
    //  where: { email: data.email, tenantId: data.tenantId },
    });

    if (existingUser) {
      throw new BadRequestError('User already exists in this tenant');
    }

    return this.create(data);
  }

  async updateUserRole(userId: string, tenantId: string, role: UserRole): Promise<User> {
    return this.update(userId, { role });
  }

  async deactivateUser(userId: string, tenantId: string): Promise<User> {
    return this.update(userId, { status: UserStatus.SUSPENDED });
  }

  async activateUser(userId: string, tenantId: string): Promise<User> {
    return this.update(userId, { status: UserStatus.ACTIVE });
  }

  // async findAllByTenant(tenantId: string, options?: any): Promise<User[]> {
  //   return this.findAllByTenant(tenantId, {
  //     ...options,
  //     order: { createdAt: 'DESC' },
  //   });
  // }

  async findAllByTenant(tenantId: string, options?: any): Promise<User[]> {
  return this.repository.find({
    where: { tenantId },
    order: { createdAt: 'DESC' },
    ...options,
  });
}

  async deactivateAllUsers(tenantId: string): Promise<void> {
    await this.repository.update(
      { tenantId },
      { status: UserStatus.SUSPENDED }
    );
  }
}
