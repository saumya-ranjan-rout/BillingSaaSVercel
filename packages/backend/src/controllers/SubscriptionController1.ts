import { Request, Response } from 'express';
import { SubscriptionService } from '../services/billing/SubscriptionService';

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  async createSubscription(req: Request, res: Response) {
    try {
      const tenantId = req.user.tenantId;
      const { planId, paymentMethodId } = req.body;
      const subscription = await this.subscriptionService.createSubscription(
        tenantId,
        planId,
        paymentMethodId
      );
      res.status(201).json(subscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancelSubscription(req: Request, res: Response) {
    try {
      const tenantId = req.user.tenantId;
      const subscription = await this.subscriptionService.cancelSubscription(tenantId);
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSubscription(req: Request, res: Response) {
    try {
      const tenantId = req.user.tenantId;
      const subscription = await this.subscriptionService.getSubscription(tenantId);
      res.json(subscription);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
