import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription/SubscriptionService';
import { TenantService } from '../services/tenant/TenantService';

const subscriptionService = new SubscriptionService();
const tenantService = new TenantService();

export class TenantOnboardingController {
  static async createTenantWithSubscription(req: Request, res: Response) {
    try {
      const { tenantData, planId, paymentMethodId, professionalId } = req.body;

      // Create tenant
      const tenant = await tenantService.createTenant(tenantData);

      // Create subscription (paid by tenant or professional)
      const subscription = await subscriptionService.subscribeTenant(
        tenant.id,
        planId,
        paymentMethodId,
        professionalId // Optional: if professional is paying
      );

      // If professional is assigned, create the relationship
      if (professionalId) {
        // This would require a professional service to assign the professional
        // await professionalService.assignProfessionalToTenant(professionalId, tenant.id, {});
      }

      res.status(201).json({
        message: 'Tenant created and subscribed successfully',
        tenant,
        subscription
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSubscriptionPlans(req: Request, res: Response) {
    try {
      const plans = await subscriptionService.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
