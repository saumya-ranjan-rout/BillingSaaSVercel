import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { BillingService } from '../services/billing/BillingService';
import { PlanType } from '../entities/SubscriptionPlan';
import logger from '../utils/logger';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export class BillingController {
  constructor(private billingService: BillingService) {}

  async createSubscription(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { planType, entityId, paymentMethod } = req.body;
      const result = await this.billingService.createSubscription(
        planType,
        entityId,
        paymentMethod
      );

      res.json({
        success: true,
        subscription: result.subscription,
        payment: result.payment,
        razorpayOrder: result.payment.gatewayResponse
      });
    } catch (error) {
      logger.error('Create subscription error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async handlePaymentSuccess(req: Request, res: Response) {
    try {
      const { paymentId, razorpayPaymentId, razorpayResponse } = req.body;
      
      const payment = await this.billingService.handlePaymentSuccess(
        paymentId,
        razorpayPaymentId,
        razorpayResponse
      );

      res.json({
        success: true,
        payment,
        message: 'Payment successful! Subscription activated.'
      });
    } catch (error) {
      logger.error('Payment success handling error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async handlePaymentFailure(req: Request, res: Response) {
    try {
      const { paymentId, razorpayResponse } = req.body;
      
      const payment = await this.billingService.handlePaymentFailure(
        paymentId,
        razorpayResponse
      );

      res.json({
        success: false,
        payment,
        message: 'Payment failed. Please try again.'
      });
    } catch (error) {
      logger.error('Payment failure handling error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async createProfessionalClient(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const professionalId = (req as any).user?.id;
      const { tenantData, paymentMethod } = req.body;

      const result = await this.billingService.createProfessionalClientSubscription(
        professionalId,
        tenantData,
        paymentMethod
      );

      res.json({
        success: true,
        tenant: result.tenant,
        subscription: result.subscription,
        payment: result.payment,
        razorpayOrder: result.payment.gatewayResponse
      });
    } catch (error) {
      logger.error('Professional client creation error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async getSubscriptionStatus(req: Request, res: Response) {
    try {
      const { entityId, planType } = req.params;
      
      const status = await this.billingService.checkSubscriptionStatus(
        entityId,
        planType as PlanType
      );

      res.json({
        success: true,
        ...status
      });
    } catch (error) {
      logger.error('Subscription status check error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async cancelSubscription(req: Request, res: Response) {
    try {
      const { subscriptionId } = req.params;
      
      const subscription = await this.billingService.cancelSubscription(subscriptionId);

      res.json({
        success: true,
        subscription,
        message: 'Subscription cancelled successfully'
      });
    } catch (error) {
      logger.error('Subscription cancellation error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async getSubscriptionPayments(req: Request, res: Response) {
    try {
      const { subscriptionId } = req.params;
      
      const payments = await this.billingService.getSubscriptionPayments(subscriptionId);

      res.json({
        success: true,
        payments
      });
    } catch (error) {
      logger.error('Subscription payments fetch error:', error);
      res.status(400).json({ 
        success: false, 
        error: getErrorMessage(error) 
      });
    }
  }

  async handleRazorpayWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

      // Verify webhook signature
      const isValid = this.billingService['razorpayService'].verifyWebhookSignature(
        req.body,
        signature,
        webhookSecret
      );

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }

      const event = req.body;
      
      // Handle different webhook events
      switch (event.event) {
        case 'payment.captured':
          // Handle successful payment
          break;
        case 'payment.failed':
          // Handle failed payment
          break;
        case 'subscription.charged':
          // Handle subscription renewal
          break;
        case 'subscription.cancelled':
          // Handle subscription cancellation
          break;
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Webhook handling error:', error);
      res.status(400).json({ error: 'Webhook processing failed' });
    }
  }
}
