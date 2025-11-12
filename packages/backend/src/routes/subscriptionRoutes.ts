import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { rbacMiddleware } from '../middleware/rbac';
import { validationMiddleware } from '../middleware/validation';
import { createSubscriptionSchema } from '../utils/validators';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();
const subscriptionController = new SubscriptionController();

// require auth + tenant context for all
router.use(authMiddleware, tenantMiddleware);

// GET plans + history
router.get(
  '/plans',
  rbacMiddleware(['read:subscription']),
  cacheMiddleware('5 minutes'),
  subscriptionController.getPlans.bind(subscriptionController)
);

// Create order (subscribe) -> returns razorpay order details + payment id
router.post(
  '/create-order',
  rbacMiddleware(['manage:subscription']),
  validationMiddleware(createSubscriptionSchema),
  subscriptionController.createSubscription.bind(subscriptionController)
);

// Payment success callback from frontend (after checkout)
router.post(
  '/payment/success',
  subscriptionController.handlePaymentSuccess.bind(subscriptionController)
);

// optional: get current subscription or stats
router.get(
  '/current',
  rbacMiddleware(['read:subscription']),
  subscriptionController.getCurrentSubscription.bind(subscriptionController)
);

router.delete(
  '/',
  rbacMiddleware(['manage:subscription']),
  subscriptionController.cancelSubscription.bind(subscriptionController)
);

export default router;

