import { Repository, ILike, IsNull } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Customer } from '../../entities/Customer';
import { validateGSTIN } from '../../utils/validators';
import logger from '../../utils/logger';
import { PaginatedResponse } from '../../types/customTypes';
 
export class CustomerService {
  private customerRepository: Repository<Customer>;
 
  constructor() {
    this.customerRepository = AppDataSource.getRepository(Customer);
  }
 
  //async createCustomer(tenantId: string, customerData: any): Promise<Customer> {
  async createCustomer(tenantId: string, customerData: Partial<Customer>): Promise<Customer>{
    try {
      // Validate GSTIN if provided
      if (customerData.gstin && !validateGSTIN(customerData.gstin)) {
        throw new Error('Invalid GSTIN format');
      }

         if (customerData.phone && !/^[6-9]\d{9}$/.test(customerData.phone)) {
      throw new Error('Invalid phone number format');
    }
 
      // Check if customer with same email already exists for this tenant
      const existingCustomer = await this.customerRepository.findOne({
        where: {
          email: customerData.email,
          tenantId,
          deletedAt: IsNull()
        }
      });
 
      if (existingCustomer) {
        throw new Error('Customer with this email already exists');
      }
 
       const customer = this.customerRepository.create({
        ...customerData,
        tenantId
      });
 
       //const savedCustomer = await this.customerRepository.save(customer);
     const savedCustomer = await this.customerRepository.save(customer);

const completeCustomer = await this.customerRepository.findOne({
  where: { id: savedCustomer.id, deletedAt: IsNull() },
  relations: ['tenant'],
});

if (!completeCustomer) {
  throw new Error('Failed to fetch created customer');
}
 
      return completeCustomer;
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw error;
    }
  }
 
  async getCustomer(tenantId: string, customerId: string): Promise<Customer> {
    try {
      const customer = await this.customerRepository.findOne({
        where: {
          id: customerId,
          tenantId,
          deletedAt: IsNull()
        },
        relations: ['tenant']
      });
 
      if (!customer) {
        throw new Error('Customer not found');
      }
 
      return customer;
    } catch (error) {
      logger.error('Error fetching customer:', error);
      throw error;
    }
  }
 

  async getCustomers(
  tenantId: string,
  options: {
    page: number;
    limit: number;
    search?: string;
  }
): Promise<PaginatedResponse<Customer>> {
  try {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const whereConditions: any = {
      tenantId,
      status: "Approved",
      deletedAt: IsNull(),
    };

    if (search) {
      whereConditions["name"] = ILike(`%${search}%`);
      whereConditions["email"] = ILike(`%${search}%`);
      whereConditions["phone"] = ILike(`%${search}%`);
    }

    const [customers, total] = await this.customerRepository.findAndCount({
      where: whereConditions,
      relations: ["requestedBy", "requestedTo"],  // Load both user relations
      skip,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error("Error fetching customers:", error);
    throw error;
  }
}

  // async getCustomers(tenantId: string, options: {
  //   page: number;
  //   limit: number;
  //   search?: string;
  // }): Promise<PaginatedResponse<Customer>> {
  //   try {
  //     const { page, limit, search } = options;
  //     const skip = (page - 1) * limit;
 
  //     let whereConditions: any = {
  //       tenantId,
  //       status: 'Approved',
  //       deletedAt: IsNull()
  //     };
 
  //     if (search) {
  //       whereConditions = [
  //         {
  //           tenantId,
  //           name: ILike(`%${search}%`),
  //           deletedAt: IsNull()
  //         },
  //         {
  //           tenantId,
  //           email: ILike(`%${search}%`),
  //           deletedAt: IsNull()
  //         },
  //         {
  //           tenantId,
  //           phone: ILike(`%${search}%`),
  //           deletedAt: IsNull()
  //         }
  //       ];
  //     }
 
  //     const [customers, total] = await this.customerRepository.findAndCount({
  //       where: whereConditions,
  //       skip,
  //       take: limit,
  //       order: { createdAt: 'DESC' }
  //     });
 
  //     return {
  //       data: customers,
  //       pagination: {
  //         page,
  //         limit,
  //         total,
  //         pages: Math.ceil(total / limit)
  //       }
  //     };
  //   } catch (error) {
  //     logger.error('Error fetching customers:', error);
  //     throw error;
  //   }
  // }
 
  async updateCustomer(tenantId: string, customerId: string, updates: any): Promise<Customer> {
    try {
      // Validate GSTIN if provided
      if (updates.gstin && !validateGSTIN(updates.gstin)) {
        throw new Error('Invalid GSTIN format');
      }
 
      const customer = await this.getCustomer(tenantId, customerId);
 
      // Check if email is being changed and if it's already taken
      if (updates.email && updates.email !== customer.email) {
        const existingCustomer = await this.customerRepository.findOne({
          where: {
            email: updates.email,
            tenantId,
            deletedAt: IsNull()
          }
        });
 
        if (existingCustomer && existingCustomer.id !== customerId) {
          throw new Error('Customer with this email already exists');
        }
      }
 
      // Update customer
      Object.assign(customer, updates);
      await this.customerRepository.save(customer);
      
      // Return the updated customer with relations
      const updatedCustomer = await this.customerRepository.findOne({
        where: { id: customerId, deletedAt: IsNull() },
        relations: ['tenant']
      });
 
      if (!updatedCustomer) {
        throw new Error('Failed to fetch updated customer');
      }
 
      return updatedCustomer;
    } catch (error) {
      logger.error('Error updating customer:', error);
      throw error;
    }
  }
 
  async deleteCustomer(tenantId: string, customerId: string): Promise<void> {
    try {
      const customer = await this.getCustomer(tenantId, customerId);
      
      // Soft delete: set deletedAt timestamp
      customer.deletedAt = new Date();
      await this.customerRepository.save(customer);
    } catch (error) {
      logger.error('Error deleting customer:', error);
      throw error;
    }
  }
 
  async searchCustomers(tenantId: string, query: string): Promise<Customer[]> {
    try {
      if (!query || query.length < 2) {
        throw new Error('Search query must be at least 2 characters long');
      }
 
      const customers = await this.customerRepository.find({
        where: [
          {
            tenantId,
            name: ILike(`%${query}%`),
            deletedAt: IsNull()
          },
          {
            tenantId,
            email: ILike(`%${query}%`),
            deletedAt: IsNull()
          },
          {
            tenantId,
            phone: ILike(`%${query}%`),
            deletedAt: IsNull()
          },
          {
            tenantId,
            gstin: ILike(`%${query}%`),
            deletedAt: IsNull()
          }
        ],
        take: 10
      });
 
      return customers;
    } catch (error) {
      logger.error('Error searching customers:', error);
      throw error;
    }
  }
 
  async getCustomerByGSTIN(tenantId: string, gstin: string): Promise<Customer | null> {
    try {
      const customer = await this.customerRepository.findOne({
        where: {
          tenantId,
          gstin,
          deletedAt: IsNull()
        }
      });
      return customer;
    } catch (error) {
      logger.error('Error fetching customer by GSTIN:', error);
      throw error;
    }
  }
 
  async getCustomersWithInvoices(tenantId: string, options: { page: number; limit: number; search?: string }) {
    const query = this.customerRepository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.invoices', 'invoice')
      .where('customer.tenantId = :tenantId', { tenantId })
      .andWhere('customer.deletedAt IS NULL');
 
    if (options.search) {
      query.andWhere('customer.name ILIKE :search OR customer.email ILIKE :search', {
        search: `%${options.search}%`
      });
    }
 
    query.skip((options.page - 1) * options.limit).take(options.limit);
    const [result, total] = await query.getManyAndCount();
 
    return {
      data: result,
      total,
      page: options.page,
      limit: options.limit,
    };
  }
}















