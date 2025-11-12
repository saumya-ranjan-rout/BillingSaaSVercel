import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription/SubscriptionService';
import { RazorpayService } from '../services/payment/RazorpayService';
import { ok, errorResponse, created } from '../utils/response';
import logger from '../utils/logger';

export class SubscriptionController {
  private subscriptionService: SubscriptionService;
  private razorpayService: RazorpayService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
    this.razorpayService = new RazorpayService();
  }

  // ✅ GET /api/subscriptions/plans
  async getPlans(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;
      const tenantId = req.user.tenantId;

      const plans = await this.subscriptionService.getActivePlans();
      const history = await this.subscriptionService.getUserSubscriptionHistory(userId, tenantId);
      // const currentPlan = history.find((s: any) => s.status === 'active') || null;
const today = new Date();

const currentPlan = history.find((s: any) => {
   const startDate = new Date(s.startDate);
  const endDate = new Date(s.endDate);
  return endDate > today && startDate < today && (s.status === 'active' || s.status === 'trial');
}) || null;
     
//       console.log('history', history);
//  console.log('currentPlan', currentPlan);

      return ok(res, { plans, history, currentPlan }, 'Subscription plans fetched successfully');
    } catch (error) {
      logger.error('Error fetching subscription plans:', error);
      return errorResponse(res, 'Failed to fetch subscription plans');
    }
  }

  // ✅ POST /api/subscriptions/create-order
  async createSubscription(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;
      const tenantId = req.user.tenantId;
      const { planId, paymentGateway = 'razorpay' } = req.body;

  const plan = await this.subscriptionService.getPlanById(planId);
  if (!plan) throw new Error('Subscription plan not found');

      const { subscription, payment } = await this.subscriptionService.createSubscription(
        userId,
        planId,
        paymentGateway
      );

     // console.log('plan.price', plan.price);
       if (Number(plan.price) === 0) {
      await this.subscriptionService.activateFreeTrial(subscription.id);

      return created(res, {
        subscriptionId: subscription.id,
        message: 'Free trial activated successfully',
         freeTrial: true
      });
    }

      const order = await this.razorpayService.createOrder(payment);

      return created(res, {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id,
        subscriptionId: subscription.id
      }, 'Order created');
    } catch (error) {
      logger.error('Error creating subscription/order:', error);
      return errorResponse(res, 'Failed to create subscription order');
    }
  }

  // ✅ POST /api/subscriptions/payment/success
  async handlePaymentSuccess(req: Request, res: Response) {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        payment_id
      } = req.body;

      const isValid = await this.razorpayService.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return errorResponse(res, 'Invalid payment signature', 400);
      }

      const { subscription, payment } = await this.subscriptionService.processPaymentSuccess(
        payment_id,
        razorpay_payment_id,
        req.body
      );

      return ok(res, { subscription, payment }, 'Payment processed successfully');
    } catch (error) {
      logger.error('Error processing payment success:', error);
      return errorResponse(res, 'Failed to process payment');
    }
  }

  async getCurrentSubscription(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;
      const subscription = await this.subscriptionService.getUserSubscription(userId);

      if (!subscription) {
        return errorResponse(res, 'No subscription found', 404);
      }

      return ok(res, subscription, 'Subscription fetched successfully');
    } catch (error) {
      logger.error('Error fetching subscription:', error);
      return errorResponse(res, 'Failed to fetch subscription');
    }
  }

  async cancelSubscription(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;
      const subscription = await this.subscriptionService.cancelSubscription(userId);

      return ok(res, subscription, 'Subscription cancelled successfully');
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      return errorResponse(res, 'Failed to cancel subscription');
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenantId = req.user.tenantId;
      const stats = await this.subscriptionService.getSubscriptionStats(tenantId);

      return ok(res, stats, 'Subscription stats fetched successfully');
    } catch (error) {
      logger.error('Error fetching subscription stats:', error);
      return errorResponse(res, 'Failed to fetch subscription stats');
    }
  }
}













