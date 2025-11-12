import { Repository, ILike, IsNull  } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Vendor } from '../../entities/Vendor';
import { validateGSTIN, validatePAN } from '../../utils/validators';
import logger from '../../utils/logger';
import { PaginatedResponse } from '../../types/customTypes';

export class VendorService {
  private vendorRepository: Repository<Vendor>;

  constructor() {
    this.vendorRepository = AppDataSource.getRepository(Vendor);
  }

 
  async createVendor(tenantId: string, vendorData: Partial<Vendor>): Promise<Vendor> {
    try {
      // Validate GSTIN if provided
      if (vendorData.gstin && !validateGSTIN(vendorData.gstin)) {
        throw new Error('Invalid GSTIN format');
      }

      // Validate PAN if provided
      if (vendorData.pan && !validatePAN(vendorData.pan)) {
        throw new Error('Invalid PAN format');
      }

      // Check if vendor with same name already exists for this tenant
      const existingVendor = await this.vendorRepository.findOne({
        where: { name: vendorData.name, tenantId, deletedAt: IsNull() }
      });

      if (existingVendor) {
        throw new Error('Vendor with this name already exists');
      }

      // Create and save a single vendor entity
      const vendor = this.vendorRepository.create({
        ...vendorData,
        tenantId
      });

      const savedVendor: Vendor = await this.vendorRepository.save(vendor);
      return savedVendor;
    } catch (error) {
      logger.error('Error creating vendor:', error);
      throw error;
    }
  }

  async getVendor(tenantId: string, vendorId: string): Promise<Vendor> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { id: vendorId, tenantId, deletedAt: IsNull() },
        relations: ['tenant']
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
  }): Promise<PaginatedResponse<Vendor>> {
    try {
      const { page, limit, search } = options;
      const skip = (page - 1) * limit;

      let whereConditions: any = { tenantId, deletedAt: IsNull() };

      if (search) {
        whereConditions = [
          { tenantId, name: ILike(`%${search}%`), deletedAt: IsNull() },
          { tenantId, email: ILike(`%${search}%`), deletedAt: IsNull() },
          { tenantId, phone: ILike(`%${search}%`), deletedAt: IsNull() }
        ];
      }

      const [vendors, total] = await this.vendorRepository.findAndCount({
        where: whereConditions,
        skip,
        take: limit,
        order: { createdAt: 'DESC' }
      });

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

  async updateVendor(tenantId: string, vendorId: string, updates: any): Promise<Vendor> {
    try {
      // Validate GSTIN if provided
      if (updates.gstin && !validateGSTIN(updates.gstin)) {
        throw new Error('Invalid GSTIN format');
      }

      // Validate PAN if provided
      if (updates.pan && !validatePAN(updates.pan)) {
        throw new Error('Invalid PAN format');
      }

      const vendor = await this.getVendor(tenantId, vendorId);

      // Check if name is being changed and if it's already taken
      if (updates.name && updates.name !== vendor.name) {
        const existingVendor = await this.vendorRepository.findOne({
          where: { name: updates.name, tenantId, deletedAt: IsNull() }
        });

        if (existingVendor && existingVendor.id !== vendorId) {
          throw new Error('Vendor with this name already exists');
        }
      }

      // Update vendor
      Object.assign(vendor, updates);
      return await this.vendorRepository.save(vendor);
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw error;
    }
  }

  async deleteVendor(tenantId: string, vendorId: string): Promise<void> {
    try {
      const vendor = await this.getVendor(tenantId, vendorId);
      
      // Soft delete: set deletedAt timestamp
      vendor.deletedAt = new Date();
      await this.vendorRepository.save(vendor);
    } catch (error) {
      logger.error('Error deleting vendor:', error);
      throw error;
    }
  }

  async searchVendors(tenantId: string, query: string): Promise<Vendor[]> {
    try {
      if (!query || query.length < 2) {
        throw new Error('Search query must be at least 2 characters long');
      }

      const vendors = await this.vendorRepository.find({
        where: [
          { tenantId, name: ILike(`%${query}%`), deletedAt: IsNull() },
          { tenantId, email: ILike(`%${query}%`), deletedAt: IsNull() },
          { tenantId, phone: ILike(`%${query}%`), deletedAt: IsNull() },
          { tenantId, gstin: ILike(`%${query}%`), deletedAt: IsNull() }
        ],
        take: 10
      });

      return vendors;
    } catch (error) {
      logger.error('Error searching vendors:', error);
      throw error;
    }
  }

  async getVendorByGSTIN(tenantId: string, gstin: string): Promise<Vendor | null> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { tenantId, gstin, deletedAt: IsNull() }
      });
      return vendor;
    } catch (error) {
      logger.error('Error fetching vendor by GSTIN:', error);
      throw error;
    }
  }

  async updateOutstandingBalance(tenantId: string, vendorId: string, amount: number): Promise<void> {
    try {
      const vendor = await this.getVendor(tenantId, vendorId);
      vendor.outstandingBalance = Number(vendor.outstandingBalance) + amount;
      await this.vendorRepository.save(vendor);
    } catch (error) {
      logger.error('Error updating vendor balance:', error);
      throw error;
    }
  }
}
