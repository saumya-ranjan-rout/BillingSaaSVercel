import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PurchaseService } from '../services/purchases/PurchaseService';
import { PurchaseOrderStatus } from '../entities/PurchaseOrder';
import logger from '../utils/logger';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  async createPurchaseOrder(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenantId = req.user.tenantId;
      const purchaseData = req.body;
      const purchaseOrder = await this.purchaseService.createPurchaseOrder(tenantId, purchaseData);
      res.status(201).json(purchaseOrder);
    } catch (error) {
      logger.error('Error creating purchase order:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getPurchaseOrder(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;
      const purchaseOrder = await this.purchaseService.getPurchaseOrder(tenantId, id);
      res.json(purchaseOrder);
    } catch (error) {
      logger.error('Error fetching purchase order:', error);
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }

  async getPurchaseOrders(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenantId = req.user.tenantId;
      const { page, limit, search, status, vendorId } = req.query;
      const options = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        search: search as string,
        status: status as PurchaseOrderStatus,
        vendorId: vendorId as string
      };
      const purchaseOrders = await this.purchaseService.getPurchaseOrders(tenantId, options);
      res.json(purchaseOrders);
    } catch (error) {
      logger.error('Error fetching purchase orders:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async updatePurchaseOrder(req: Request, res: Response) {
    // console.log("hi updatePurchaseOrder");
    // console.log(req.body);
    // console.log(req.params);
    // console.log(req.user);
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
      const updates = req.body;
      const purchaseOrder = await this.purchaseService.updatePurchaseOrder(tenantId, id, updates);
      res.json(purchaseOrder);
    } catch (error) {
      logger.error('Error updating purchase order:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async updatePurchaseOrderStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const { status } = req.body;
      const tenantId = req.user.tenantId;
      
      const purchaseOrder = await this.purchaseService.updatePurchaseOrderStatus(tenantId, id, status);
      res.json(purchaseOrder);
    } catch (error) {
      logger.error('Error updating purchase order status:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async deletePurchaseOrder(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;
      await this.purchaseService.deletePurchaseOrder(tenantId, id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting purchase order:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getVendorPurchaseOrders(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { vendorId } = req.params;
      const tenantId = req.user.tenantId;
      const purchaseOrders = await this.purchaseService.getVendorPurchaseOrders(tenantId, vendorId);
      res.json(purchaseOrders);
    } catch (error) {
      logger.error('Error fetching vendor purchase orders:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getPurchaseOrderSummary(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenantId = req.user.tenantId;
      const summary = await this.purchaseService.getPurchaseOrderSummary(tenantId);
      res.json(summary);
    } catch (error) {
      logger.error('Error fetching purchase order summary:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
