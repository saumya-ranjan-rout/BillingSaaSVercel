import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { LoyaltyService } from '../services/loyalty/LoyaltyService';
import logger from '../utils/logger';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export class LoyaltyController {
  constructor(private loyaltyService: LoyaltyService) {}

  async processInvoice(req: Request, res: Response) {
    try {
      const { invoiceId } = req.params;
      
      await this.loyaltyService.processInvoiceForLoyalty(invoiceId);

      res.json({
        success: true,
        message: 'Invoice processed for loyalty points'
      });
    } catch (error) {
      logger.error('Invoice processing error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async redeemCashback(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tenantId = (req as any).user?.tenantId;
      const { customerId, amount, invoiceId } = req.body;

      const transaction = await this.loyaltyService.redeemCashback(
        tenantId,
        customerId,
        amount,
        invoiceId
      );

      res.json({
        success: true,
        transaction,
        message: 'Cashback redeemed successfully'
      });
    } catch (error) {
      logger.error('Cashback redemption error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async getCustomerSummary(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user?.tenantId;
      const { customerId } = req.params;

      const summary = await this.loyaltyService.getCustomerLoyaltySummary(tenantId, customerId);

      res.json({
        success: true,
        ...summary
      });
    } catch (error) {
      logger.error('Customer summary error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async updateProgram(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tenantId = (req as any).user?.tenantId;
      const { programId } = req.params;
      const updates = req.body;

      const program = await this.loyaltyService.updateLoyaltyProgram(tenantId, programId, updates);

      res.json({
        success: true,
        program,
        message: 'Loyalty program updated successfully'
      });
    } catch (error) {
      logger.error('Program update error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async getProgramStats(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user?.tenantId;
      const { programId } = req.params;

      const stats = await this.loyaltyService.getProgramStatistics(tenantId, programId);

      res.json({
        success: true,
        ...stats
      });
    } catch (error) {
      logger.error('Program stats error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async calculateCashback(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tenantId = (req as any).user?.tenantId;
      const { customerId, amount } = req.body;

      const result = await this.loyaltyService.calculateCashback(tenantId, customerId, amount);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error('Cashback calculation error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async getActiveProgram(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user?.tenantId;
      const program = await this.loyaltyService.getActiveProgram(tenantId);

      res.json({
        success: true,
        program
      });
    } catch (error) {
      logger.error('Get active program error:', error);
      res.status(400).json({
        success: false,
        error: getErrorMessage(error)
      });
    }
  }
}
