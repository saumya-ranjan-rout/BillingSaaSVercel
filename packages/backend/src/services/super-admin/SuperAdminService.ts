import { Repository, Between, Like, In, MoreThan, LessThan, MoreThanOrEqual,getRepository,QueryRunner } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { SuperAdmin } from '../../entities/SuperAdmin';
import { AuditLog, AuditAction, AuditResource } from '../../entities/AuditLog';
import { User, UserRole, UserStatus } from '../../entities/User';
import { Tenant, TenantStatus } from '../../entities/Tenant';
import { ProfessionalUser, ProfessionalType } from '../../entities/ProfessionalUser';
import { Subscription } from '../../entities/Subscription';
import logger from '../../utils/logger';
import * as bcrypt from "bcryptjs";
import { CacheService } from '../cache/CacheService';

interface FilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  professionalType?: string; // ✅ add this line
}

export class SuperAdminService {
  private superAdminRepository: Repository<SuperAdmin>;
  private auditLogRepository: Repository<AuditLog>;
  private userRepository: Repository<User>;
  private tenantRepository: Repository<Tenant>;
  private professionalRepository: Repository<ProfessionalUser>;
  private subscriptionRepository: Repository<Subscription>;
  private cacheService: CacheService

  constructor() {
    this.superAdminRepository = AppDataSource.getRepository(SuperAdmin);
    this.auditLogRepository = AppDataSource.getRepository(AuditLog);
    this.userRepository = AppDataSource.getRepository(User);
    this.tenantRepository = AppDataSource.getRepository(Tenant);
    this.professionalRepository = AppDataSource.getRepository(ProfessionalUser);
    this.subscriptionRepository = AppDataSource.getRepository(Subscription);
    this.cacheService = new CacheService();
  }

async createSuperAdmin(superAdminData: any): Promise<SuperAdmin> {
    try {
      const user = this.userRepository.create({
        email: superAdminData.email,
        password: superAdminData.password,
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE
      });

      const savedUser = await this.userRepository.save(user);

      // ✅ Explicitly ensure it's not an array
      const superAdminEntity = this.superAdminRepository.create({
        ...superAdminData,
        userId: savedUser.id
      }) as unknown as SuperAdmin;

      // ✅ Save single entity (not array)
      const savedSuperAdmin = await this.superAdminRepository.save(superAdminEntity);

      return savedSuperAdmin;
    } catch (error) {
      logger.error('Error creating super admin:', error);
      throw error;
    }
  }


  async getDashboardStats(): Promise<any> {
    try {
      const totalUsers = await this.userRepository.count();
      const totalTenants = await this.tenantRepository.count();
      const totalProfessionals = await this.professionalRepository.count();
      
   const now = new Date();

const activeSubscriptions = await AppDataSource.getRepository('subscriptions').count({
  where: [
    { status: 'active', endDate: MoreThanOrEqual(now) },
    { status: 'trial', endDate: MoreThanOrEqual(now) },
  ],
});
      
      const recentSignups = await this.userRepository.find({
        where: { createdAt: Between(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()) },
        order: { createdAt: 'DESC' },
        take: 10
      });

      const revenueData = await this.getRevenueData();
      const systemHealth = await this.getSystemHealth();

      return {
        totalUsers,
        totalTenants,
        totalProfessionals,
        activeSubscriptions,
        recentSignups,
        revenueData,
        systemHealth
      };
    } catch (error) {
      logger.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getUsersWithFilters(filters: FilterOptions): Promise<any> {
    try {
      const { page = 1, limit = 10, search, startDate, endDate, status, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
      const skip = (page - 1) * limit;

      let query = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.tenant', 'tenant')
        .where('user.role != :role', { role: 'super_admin' });

      if (search) {
        query = query.andWhere(
          '(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (status) {
        query = query.andWhere('user.isActive = :status', { status: status === 'active' });
      }

      if (startDate && endDate) {
        query = query.andWhere('user.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
      }

      const [users, total] = await query
        .orderBy(`user.${sortBy}`, sortOrder)
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching users with filters:', error);
      throw error;
    }
  }
 async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;       // Use enum
    status: UserStatus;   // Use enum
    password: string;
    tenantId: string;
  }): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create User entity
      const user = this.userRepository.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        status: data.status,
        password: hashedPassword,
        tenant: { id: data.tenantId } as Tenant, // Cast to Tenant
      });

      // Save single user
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

 async updateUser(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      role: UserRole;
      status: UserStatus;
      tenantId: string;
    }>
  ): Promise<User> {
    try {
      const updateData: Partial<User> = { ...data };

      if (data.tenantId) {
        updateData.tenant = { id: data.tenantId } as Tenant;
      }

      await this.userRepository.update(id, updateData);

      // Return the updated user
      const updatedUser = await this.userRepository.findOne({
        where: { id },
        relations: ['tenant'],
      });

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }
async createTenant(data: Partial<Tenant>): Promise<Tenant> {
  const tenant = this.tenantRepository.create({
    ...data,
    status:TenantStatus.ACTIVE,
    isActive: true,
  });
  return await this.tenantRepository.save(tenant);
}

async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant> {
  // Remove 'subscriptions' and 'professionals' from data to avoid trying to update them
  const { subscriptions, professionals, ...tenantData } = data;
  // Update only the non-related properties
  await this.tenantRepository.update(id, tenantData);
  // Fetch the updated tenant without trying to include the subscriptions or professionals
  const updatedTenant = await this.tenantRepository.findOne({ where: { id } });
  if (!updatedTenant) throw new Error('Tenant not found');
  return updatedTenant;
}

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
  }

  async getTenantsWithFilters(filters: FilterOptions): Promise<any> {
    try {
      const { page = 1, limit = 10, search, startDate, endDate, status, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
      const skip = (page - 1) * limit;

      let query = this.tenantRepository.createQueryBuilder('tenant')
        .leftJoinAndSelect('tenant.subscriptions', 'subscription')
        .leftJoinAndSelect('tenant.professionals', 'professionals');

      if (search) {
        query = query.andWhere(
          '(tenant.name ILIKE :search OR tenant.email ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (status) {
        if (status === 'active') {
          query = query.andWhere('subscription.status = :status', { status: 'active' });
        } else if (status === 'inactive') {
          query = query.andWhere('(subscription.status IS NULL OR subscription.status != :status)', { status: 'active' });
        }
      }

      if (startDate && endDate) {
        query = query.andWhere('tenant.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
      }

      const [tenants, total] = await query
        .orderBy(`tenant.${sortBy}`, sortOrder)
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data: tenants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching tenants with filters:', error);
      throw error;
    }
  }

 // Add the following methods in your SuperAdminService:
async getSubscriptions(): Promise<any> {
  try {
    // Use the Subscription repository to join tenant, user, and subscription plan
    const subscriptions = await this.subscriptionRepository.createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.tenant', 'tenant') // Join tenant
      .leftJoinAndSelect('subscription.user', 'user') // Join user
      .leftJoinAndSelect('subscription.plan', 'plan')  // Join subscription plan
      .select([
        'subscription.id AS id',
        'tenant.name as tenantName',  // Select tenant name
        'tenant.businessName',  // Select business name
        'user.firstName as userFirstName', // Select user first name
        'user.lastName as userLastName',  // Select user last name
        'subscription.status', 
        'subscription.startDate', 
        'subscription.endDate',
        'plan.name as planName',  // Select plan name
        'plan.type as planType',  // Select plan type
        'plan.price as planPrice', // Select plan price
        'plan.billingCycle as planBillingCycle', // Select plan billing cycle
      ])
      .getRawMany();  // Fetch the subscriptions along with the joined data

    //console.log('service subscriptions', subscriptions);

    return subscriptions;
  } catch (error) {
    logger.error('Error fetching subscriptions:', error);
    throw error;
  }
}



// Create Professional (User + ProfessionalUser)
async createProfessional(data: any): Promise<ProfessionalUser> {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Step 1: Create User
    const user = queryRunner.manager.create(this.userRepository.target, {
      email: data.email,
      password: data.password.trim(),
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.PROFESSIONAL,
      status: UserStatus.ACTIVE,
      tenantId: data.tenantId,
    });
    const savedUser = await queryRunner.manager.save(user);

    // Step 2: Create ProfessionalUser linked to User
    const professional = queryRunner.manager.create(this.professionalRepository.target, {
      userId: savedUser.id,
      professionalType: data.professionalType,
      firmName: data.firmName,
      professionalLicenseNumber: data.professionalLicenseNumber,
      phone: data.phone,
      address: data.address,
      isActive: data.isActive,
      managedTenants: data.tenants ? data.tenants.map((id: string) => ({ id })) : [],
      permissions: data.permissions,
    });

    const savedProfessional = await queryRunner.manager.save(professional);
          await Promise.all([
        this.cacheService.invalidatePattern(`super-admin:${professional.user.tenantId}:*`),
this.cacheService.invalidatePattern(`cache:${professional.user.tenantId}:/api/super-admin*`),
      ]);
    // ✅ Commit if both inserts succeed
    await queryRunner.commitTransaction();
    return savedProfessional;
  } catch (error) {
    // ❌ Rollback all changes if any step fails
    await queryRunner.rollbackTransaction();
    logger.error('Error creating professional:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// ==========================================================

async updateProfessional(id: string, data: any): Promise<ProfessionalUser> {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  //console.log(data);

  try {
    // Step 1: Fetch ProfessionalUser with linked User
    const professional = await queryRunner.manager.findOne(
      this.professionalRepository.target,
      {
        where: { id },
        relations: ['user'],
      }
    );

    if (!professional) throw new Error('Professional not found');

    // Step 2: Update User record
    const updatedUser = queryRunner.manager.merge(
      this.userRepository.target,
      professional.user,
      {
        firstName: data.firstName ?? professional.user.firstName,
        lastName: data.lastName ?? professional.user.lastName,
        email: data.email ?? professional.user.email,
      }
    );

    await queryRunner.manager.save(updatedUser);

    // Step 3: Prepare ProfessionalUser update data
    const { tenants, managedTenants, ...rest } = data;
    const updateData: Partial<ProfessionalUser> = { ...rest };

    // Merge and save ProfessionalUser changes
    const updatedProfessional = queryRunner.manager.merge(
      this.professionalRepository.target,
      professional,
      updateData
    );

    const savedProfessional = await queryRunner.manager.save(updatedProfessional);

          await Promise.all([
        this.cacheService.invalidatePattern(`super-admin:${professional.user.tenantId}:*`),
this.cacheService.invalidatePattern(`cache:${professional.user.tenantId}:/api/super-admin*`),
      ]);
    // ✅ Commit only if both updates succeed
    await queryRunner.commitTransaction();

    // Fetch and return updated record with user relation
    const finalResult = await this.professionalRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    return finalResult!;
  } catch (error) {
    // ❌ Rollback everything if any step fails
    await queryRunner.rollbackTransaction();
    logger.error('Error updating professional:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}



async getProfessionalsWithFilters(filters: FilterOptions): Promise<any> {
  try {
    const { page = 1, limit = 10, search, startDate, endDate, status, professionalType, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
    const skip = (page - 1) * limit;

    let query = this.professionalRepository.createQueryBuilder('professional')
      .leftJoinAndSelect('professional.user', 'user')
      .leftJoinAndSelect('professional.managedTenants', 'tenants');

    if (search) {
      query = query.andWhere(
        '(professional.firmName ILIKE :search OR user.email ILIKE :search OR professional.contactPerson ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      query = query.andWhere('professional.isActive = :status', { status: status === 'active' });
    }

    if (professionalType) {
      query = query.andWhere('professional.professionalType = :professionalType', { professionalType });
    }

    if (startDate && endDate) {
      query = query.andWhere('professional.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const [professionals, total] = await query
      .orderBy(`professional.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: professionals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error fetching professionals with filters:', error);
    throw error;
  }
}
async updateProfessionalStatus(id: string, userId: string, isActive: boolean): Promise<void> {
  try {
    // Determine user status based on isActive value
    const userStatus = isActive ? UserStatus.ACTIVE : UserStatus.SUSPENDED; // Use the enum here

    // Update the user table's status using the enum value
    await this.userRepository.update(userId, { status: userStatus });

    // Update the professional_user table's isActive column
    await this.professionalRepository.update(id, { isActive });
    
    logger.info(`Professional ${id} status updated to ${isActive}`);
  } catch (error) {
    logger.error('Error updating professional status:', error);
    throw error;
  }
}



  async getAuditLogs(filters: FilterOptions & { action?: AuditAction; resource?: AuditResource; performedById?: string }): Promise<any> {
  try {
    const {
      page = 1,
      limit = 10,
      action,
      resource,
      performedById,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'DESC',
    } = filters;

    const skip = (page - 1) * limit;

    const query = this.auditLogRepository
      .createQueryBuilder('auditLog')
      .leftJoin(User, 'user', 'user.id = auditLog.performedById')
      .addSelect(['user.firstName', 'user.lastName']);

    if (action) query.andWhere('auditLog.action = :action', { action });
    if (resource) query.andWhere('auditLog.resource = :resource', { resource });
    if (performedById) query.andWhere('auditLog.performedById = :performedById', { performedById });
    if (startDate && endDate) query.andWhere('auditLog.timestamp BETWEEN :startDate AND :endDate', { startDate, endDate });

    const [rows, total] = await Promise.all([
      query
        .orderBy(`auditLog.${sortBy}`, sortOrder)
        .skip(skip)
        .take(limit)
        .getRawMany(),
      query.getCount(),
    ]);

    // Format the output
    const formattedLogs = rows.map(row => ({
      id: row.auditLog_id,
      action: row.auditLog_action,
      timestamp: row.auditLog_timestamp,
      ipAddress: row.auditLog_ipAddress,
      performedById: row.auditLog_performedById,
      performedByName: row.user_firstName && row.user_lastName
        ? `${row.user_firstName} ${row.user_lastName}`
        : 'System',
    }));

    return {
      data: formattedLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error('Error fetching audit logs:', error);
    throw error;
  }
}


  async createAuditLog(
    performedById: string,
    action: AuditAction,
    resource: AuditResource,
    resourceId: string,
    details: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        performedById,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
        userAgent
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      logger.error('Error creating audit log:', error);
      // Don't throw error as audit logs shouldn't break the application
    }
  }

  private async getRevenueData(): Promise<any> {
    // Get revenue data for the last 12 months
    const revenueData = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const revenue = await AppDataSource.getRepository('Invoice')
        .createQueryBuilder('invoice')
        .select('SUM(invoice.totalAmount)', 'total')
        .where('invoice.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('invoice.status = :status', { status: 'paid' })
        .getRawOne();
      
      revenueData.push({
        month: startDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: parseFloat(revenue.total) || 0
      });
    }
    
    return revenueData;
  }

  private async getSystemHealth(): Promise<any> {
    // Check various system components
    const databaseStatus = await this.checkDatabaseHealth();
    const storageStatus = await this.checkStorageHealth();
    const apiStatus = await this.checkAPIHealth();
    
    return {
      database: databaseStatus,
      storage: storageStatus,
      api: apiStatus,
      lastChecked: new Date()
    };
  }

  private async checkDatabaseHealth(): Promise<{ status: string; message: string }> {
    try {
      await this.userRepository.count();
      return { status: 'healthy', message: 'Database connection is stable' };
    } catch (error) {
      return { status: 'unhealthy', message: 'Database connection failed' };
    }
  }

  private async checkStorageHealth(): Promise<{ status: string; message: string; usage: string }> {
    // This would check disk space in a real implementation
    return { status: 'healthy', message: 'Storage is sufficient', usage: '65%' };
  }

  private async checkAPIHealth(): Promise<{ status: string; message: string; responseTime: number }> {
    // This would check external API health in a real implementation
    return { status: 'healthy', message: 'All APIs are responding', responseTime: 120 };
  }

  async exportData(resource: 'users' | 'tenants' | 'professionals' | 'auditLogs', format: 'csv' | 'json', filters: any): Promise<string> {
    try {
      let data: any[];
      
      switch (resource) {
        case 'users':
          const usersResult = await this.getUsersWithFilters(filters);
          data = usersResult.data;
          break;
        case 'tenants':
          const tenantsResult = await this.getTenantsWithFilters(filters);
          data = tenantsResult.data;
          break;
        case 'professionals':
          const professionalsResult = await this.getProfessionalsWithFilters(filters);
          data = professionalsResult.data;
          break;
        case 'auditLogs':
          const auditLogsResult = await this.getAuditLogs(filters);
          data = auditLogsResult.data;
          break;
        default:
          throw new Error('Invalid resource type');
      }
      
      if (format === 'csv') {
        return this.convertToCSV(data);
      } else {
        return JSON.stringify(data, null, 2);
      }
    } catch (error) {
      logger.error('Error exporting data:', error);
      throw error;
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }


 // ✅ Update user status (active/inactive)
async updateUserStatus(id: string, isActive: boolean): Promise<void> {
  try {
    const statusValue = isActive ? 'active' : 'suspended'; // based on UserStatus enum
    await this.userRepository.update(id, { status: statusValue } as any);
    logger.info(`User ${id} status updated to ${statusValue}`);
  } catch (error) {
    logger.error('Error updating user status:', error);
    throw error;
  }
}

// ✅ Update tenant active/inactive status
async updateTenantStatus(id: string, isActive: boolean): Promise<void> {
  try {
    await this.tenantRepository.update(id, { isActive } as any);
         const userStatus = isActive ? UserStatus.ACTIVE : UserStatus.SUSPENDED; // Use the enum here
    // Update the user table's status using the enum value
    await this.userRepository.update({ tenantId: id }, { status: userStatus });
    logger.info(`Tenant ${id} status updated to ${isActive}`);
  } catch (error) {
    logger.error('Error updating tenant status:', error);
    throw error;
  }
}

// ✅ Update professional active/inactive status


}
