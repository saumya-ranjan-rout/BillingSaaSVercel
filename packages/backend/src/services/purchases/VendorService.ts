import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Vendor } from '../../entities/Vendor';
import logger from '../../utils/logger';

export class VendorService {
  private vendorRepository: Repository<Vendor>;

  constructor() {
    this.vendorRepository = AppDataSource.getRepository(Vendor);
  }

  async createVendor(tenantId: string, vendorData: any): Promise<Vendor> {
    try {
      const vendor = this.vendorRepository.create({
        ...vendorData,
        tenantId
      });

      return await this.vendorRepository.save(vendor);
    } catch (error) {
      logger.error('Error creating vendor:', error);
      throw error;
    }
  }

  async getVendor(tenantId: string, vendorId: string): Promise<Vendor> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { id: vendorId, tenantId }
      });

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      return vendor;
    } catch (error) {
      logger.error('Error fetching vendor:', error);
      throw error;
    }
  }

  async getVendors(tenantId: string, options: {
    page: number;
    limit: number;
    search?: string;
    isActive?: boolean;
  }): Promise<any> {
    try {
      const { page, limit, search, isActive } = options;
      const skip = (page - 1) * limit;

      let query = this.vendorRepository
        .createQueryBuilder('vendor')
        .where('vendor.tenantId = :tenantId', { tenantId });

      if (search) {
        query = query.andWhere(
          '(vendor.name ILIKE :search OR vendor.email ILIKE :search OR vendor.contactPerson ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (isActive !== undefined) {
        query = query.andWhere('vendor.isActive = :isActive', { isActive });
      }

      const [vendors, total] = await query
        .skip(skip)
        .take(limit)
        .orderBy('vendor.name', 'ASC')
        .getManyAndCount();

      return {
        data: vendors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching vendors:', error);
      throw error;
    }
  }

  async updateVendor(tenantId: string, vendorId: string, updateData: any): Promise<Vendor> {
    try {
      await this.vendorRepository.update(
        { id: vendorId, tenantId },
        updateData
      );

      return await this.getVendor(tenantId, vendorId);
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw error;
    }
  }

  async deleteVendor(tenantId: string, vendorId: string): Promise<void> {
    try {
      await this.vendorRepository.delete({ id: vendorId, tenantId });
    } catch (error) {
      logger.error('Error deleting vendor:', error);
      throw error;
    }
  }
}
