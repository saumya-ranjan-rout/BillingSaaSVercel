import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CustomerService } from '../services/customer/CustomerService';
import { CacheService } from '../services/cache/CacheService';
import logger from '../utils/logger';
import { stat } from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthService } from '../services/auth/AuthService';
import { User ,UserRole } from "../entities/User";
import { AppDataSource } from "../config/database";
//  console.log("Hi CustomerController");
// Helper function to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
 
export class CustomerController {
   private jwt: typeof jwt; 
  constructor(private customerService: CustomerService, private cacheService: CacheService,private authService: AuthService,  private userRepo = AppDataSource.getRepository(User) ) {


     this.jwt = jwt;
  }
 
  async createCustomer(req: Request, res: Response) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
 
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
 
      const tenantId = req.user.tenantId;
      // const customerData = req.body;
      // console.log("customerData",customerData);
          const customerData = {
      ...req.body,
      status: 'Approved',
      billingAddress: req.body.address,
       shippingAddress: req.body.address,
    };
     delete (customerData as any).address;
      
      const customer = await this.customerService.createCustomer(tenantId, customerData);
  await this.cacheService.invalidatePattern(`customers:${tenantId}:*`); // manual cache
await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/customers*`); // middleware cache
      await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);
      res.status(201).json(customer);
    } catch (error) {
      logger.error('Error creating customer:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
 
  async getCustomer(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
 
      const { id } = req.params;
      const tenantId = req.user.tenantId;
      
     // const customer = await this.customerService.getCustomer(tenantId, id);
           const cacheKey = `customer:${id}:${tenantId}`;
           
      
      const customer = await this.cacheService.getOrSet(cacheKey, async () => {
        return await this.customerService.getCustomer(tenantId, id);
      }, 300); // Cache for 5 minutes

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json(customer);
    } catch (error) {
      logger.error('Error fetching customer:', error);
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }
 
  async getCustomers(req: Request, res: Response) {

    //console.log("Hi CustomerController getCustomers",req);

    //console.log("Hi CustomerController getCustomers");
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
 
      const tenantId = req.user.tenantId;
     // const { page, limit, search } = req.query;
       const { page = 1, limit = 10, search } = req.query;
      
      // const options = {
      //   page: parseInt(page as string) || 1,
      //   limit: parseInt(limit as string) || 10,
      //   search: search as string
      // };

        const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));

      const options = {
        page: pageNum,
        limit: limitNum,
        search: search as string
      };
      
     // const customers = await this.customerService.getCustomers(tenantId, options);

      const cacheKey = `customers:${tenantId}:${JSON.stringify(options)}`;
      
      const customers = await this.cacheService.getOrSet(cacheKey, async () => {
        return await this.customerService.getCustomers(tenantId, options);
      }, 120); // Cache for 2 minutes


      // console.log("customers",customers);
      res.json(customers);
    } catch (error) {
      logger.error('Error fetching customers:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
 
  async updateCustomer(req: Request, res: Response) {
    //console.log("Hi CustomerController updateCustomer");
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
 
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
 
      const { id } = req.params;
      const tenantId = req.user.tenantId;
      // const updates = req.body;
       const updates = {
      ...req.body,
      billingAddress: req.body.address,
       shippingAddress: req.body.address,
    };
     delete (updates as any).address;
      
      
      const customer = await this.customerService.updateCustomer(tenantId, id, updates);

          await this.cacheService.del(`customer:${id}:${tenantId}`);
await this.cacheService.invalidatePattern(`customers:${tenantId}:*`); // manual cache
await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/customers*`); // middleware cache

      res.json(customer);
    } catch (error) {
      logger.error('Error updating customer:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
 
  async deleteCustomer(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
 
      const { id } = req.params;
      const tenantId = req.user.tenantId;
      
      await this.customerService.deleteCustomer(tenantId, id);

            await this.cacheService.del(`customer:${id}:${tenantId}`);
   await this.cacheService.invalidatePattern(`customers:${tenantId}:*`); // manual cache
await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/customers*`); // middleware cache
      await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);

      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting customer:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
 
  async searchCustomers(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
 
      const tenantId = req.user.tenantId;
      // const { query } = req.query;
      
      // const customers = await this.customerService.searchCustomers(tenantId, query as string);


       const { q } = req.query;

      if (!q || (q as string).length < 2) {
        return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
      }

      const cacheKey = `customers:search:${tenantId}:${q}`;
      
      const customers = await this.cacheService.getOrSet(cacheKey, async () => {
        return await this.customerService.searchCustomers(tenantId, q as string);
      }, 60); // Cache for 1 minute

      
      res.json(customers);
    } catch (error) {
      logger.error('Error searching customers:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
 
  async getCustomersWithInvoices(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
 
      const tenantId = req.user.tenantId;
      const { page, limit } = req.query;
      
      const options = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10
      };
      
      const customers = await this.customerService.getCustomersWithInvoices(tenantId, options);
      res.json(customers);
    } catch (error) {
      logger.error('Error fetching customers with invoices:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }


   async updateUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { tenantId } = req.params;

    const loggedtenantId = req.user.tenantId;
    const loggedId = req.user.id;

    const user = await this.customerService.updateUser(tenantId, loggedtenantId, loggedId);

//console.log(await this.cacheService.rediss.keys('*'));
     await this.cacheService.invalidatePattern(`*${loggedtenantId}*`);
//console.log(await this.cacheService.rediss.keys('*'));

    res.json({ success: true, user });
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
}


 async switchTenant(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id, role } = req.params;
    const user = req.user;

    let resolvedRole: UserRole;
    let tenantId: string | number;

    // Case 1: Professional user → tenantId comes from URL param
    if (role === "professional_user") {
      resolvedRole = UserRole.PROFESSIONAL_USER;
      tenantId = id;
    }

    // Case 2: Admin / Normal user → tenantId comes from DB
    else {
      resolvedRole = UserRole.PROFESSIONAL;

      const loggedUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: ["tenant"],
      });

      if (!loggedUser || !loggedUser.tenant) {
        return res.status(400).json({ error: "Tenant not found" });
      }

      tenantId = loggedUser.tenant.id;
    }

    // Build payload
    const payload = {
      userId: user.id,
      tenantId,
      email: user.email,
      role: resolvedRole,
      permissions: [],
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const result = await this.customerService.switchTenant(payload);

    return res.json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}


// async switchTenant(req: Request, res: Response) {
//   try {
//     const newTenantId = req.params.tenantId;

//     if (!newTenantId) {
//       return res.status(400).json({ error: "tenantId is required" });
//     }

//     const currentUser = req.user;

//     // FIX: assert req.user exists
//     if (!currentUser) {
//       return res.status(401).json({ error: "Unauthorized: User missing in request" });
//     }

//     const updatedPayload = {
//       userId: currentUser.id,
//       tenantId: newTenantId,
//       email: currentUser.email,
//       role: "professional_user",  // or dynamic role if needed
//       permissions: [],  // optional, update with correct permissions
//       firstName: currentUser.firstName,
//       lastName: currentUser.lastName
//     };

//     const result = await this.authService.switchTenant(updatedPayload);  // Pass correct object (not string)
    
//     return res.json({
//       success: true,
//       user: result.user,
//       accessToken: result.accessToken,
//       refreshToken: result.refreshToken
//     });

//   } catch (err) {
//     console.error("Error switching tenant:", err);
//     return res.status(500).json({ error: "Server error while switching tenant" });
//   }
// }





}