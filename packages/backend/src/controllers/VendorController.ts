import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { VendorService } from '../services/vendor/VendorService';
import { CacheService } from '../services/cache/CacheService';
import logger from '../utils/logger';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export class VendorController {
  constructor(private vendorService: VendorService,private cacheService: CacheService) {}

  async createVendor(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenantId = req.user.tenantId;
      // const vendorData = req.body;
       const vendorData = {
      ...req.body,
      billingAddress: req.body.address,
       shippingAddress: req.body.address,
    };
     delete (vendorData as any).address;

      const vendor = await this.vendorService.createVendor(tenantId, vendorData);

       await this.cacheService.invalidatePattern(`vendors:${tenantId}:*`);       // manual cache
      await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/vendors*`); // middleware cache


      res.status(201).json(vendor);
    } catch (error) {
      logger.error('Error creating vendor:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getVendor(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;
      const vendor = await this.vendorService.getVendor(tenantId, id);
      res.json(vendor);
    } catch (error) {
      logger.error('Error fetching vendor:', error);
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }

  async getVendors(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenantId = req.user.tenantId;
      const { page, limit, search } = req.query;
      const options = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        search: search as string
      };
      const vendors = await this.vendorService.getVendors(tenantId, options);
      res.json(vendors);
    } catch (error) {
      logger.error('Error fetching vendors:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async updateVendor(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;
      //  const updates = req.body; 
      const updates = {
        ...req.body,
        billingAddress: req.body.address,
        shippingAddress: req.body.address, 
      }
      const vendor = await this.vendorService.updateVendor(tenantId, id, updates);

            await this.cacheService.del(`vendor:${id}:${tenantId}`);
      await this.cacheService.invalidatePattern(`vendors:${tenantId}:*`);
      await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/vendors*`);


      res.json(vendor);
    } catch (error) {
      logger.error('Error updating vendor:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async deleteVendor(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;
      await this.vendorService.deleteVendor(tenantId, id);

           await this.cacheService.del(`vendor:${id}:${tenantId}`);
      await this.cacheService.invalidatePattern(`vendors:${tenantId}:*`);
      await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/vendors*`);

      
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting vendor:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async searchVendors(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenantId = req.user.tenantId;
      const { query } = req.query;
      const vendors = await this.vendorService.searchVendors(tenantId, query as string);
      res.json(vendors);
    } catch (error) {
      logger.error('Error searching vendors:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
