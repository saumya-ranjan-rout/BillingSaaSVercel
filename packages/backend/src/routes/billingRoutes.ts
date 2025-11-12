// packages/backend/src/routes/billingRoutes.ts
import { Router } from 'express';
import { BillingController } from '../controllers/BillingController';
import { BillingService } from '../services/billing/BillingService';
import { authMiddleware } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';
import { 
  createSubscriptionSchema, 
  paymentSuccessSchema,
  professionalClientSchema
} from '../utils/validators';
import { cacheMiddleware } from '../middleware/cache'; // ✅ add cache middleware

const router = Router();
const billingService = new BillingService();
const billingController = new BillingController(billingService);

// Initialize default plans
billingService.initializePlans();

// ----------------- Public routes (webhooks) -----------------
router.post(
  '/webhook/razorpay',
  billingController.handleRazorpayWebhook.bind(billingController)
);

// ----------------- Protected routes -----------------
router.post(
  '/subscriptions',
  authMiddleware,
  validationMiddleware(createSubscriptionSchema),
  billingController.createSubscription.bind(billingController)
);

router.post(
  '/payments/success',
  authMiddleware,
  validationMiddleware(paymentSuccessSchema),
  billingController.handlePaymentSuccess.bind(billingController)
);

router.post(
  '/payments/failure',
  authMiddleware,
  billingController.handlePaymentFailure.bind(billingController)
);

router.post(
  '/professional/clients',
  authMiddleware,
  requireAuth(['professional']),
  validationMiddleware(professionalClientSchema),
  billingController.createProfessionalClient.bind(billingController)
);

// ✅ Cached GET: subscription status
router.get(
  '/subscriptions/:entityId/:planType/status',
  authMiddleware,
  cacheMiddleware('2 minutes'),
  billingController.getSubscriptionStatus.bind(billingController)
);

// Delete subscription (no cache)
router.delete(
  '/subscriptions/:subscriptionId',
  authMiddleware,
  billingController.cancelSubscription.bind(billingController)
);

// ✅ Cached GET: subscription payments
router.get(
  '/subscriptions/:subscriptionId/payments',
  authMiddleware,
  cacheMiddleware('5 minutes'),
  billingController.getSubscriptionPayments.bind(billingController)
);

export default router;



// import { Router } from 'express';
// import { BillingController } from '../controllers/BillingController';
// import { BillingService } from '../services/billing/BillingService';
// import { authMiddleware } from '../middleware/auth';
// import { requireAuth } from '../middleware/auth';
// import { validationMiddleware } from '../middleware/validation';
// import { 
//   createSubscriptionSchema, 
//   paymentSuccessSchema,
//   professionalClientSchema
// } from '../utils/validators';

// const router = Router();
// const billingService = new BillingService();
// const billingController = new BillingController(billingService);

// // Initialize default plans
// billingService.initializePlans();

// // Public routes (webhooks)
// router.post(
//   '/webhook/razorpay',
//   billingController.handleRazorpayWebhook.bind(billingController)
// );

// // Protected routes
// router.post(
//   '/subscriptions',
//   authMiddleware,
//   validationMiddleware(createSubscriptionSchema),
//   billingController.createSubscription.bind(billingController)
// );

// router.post(
//   '/payments/success',
//   authMiddleware,
//   validationMiddleware(paymentSuccessSchema),
//   billingController.handlePaymentSuccess.bind(billingController)
// );

// router.post(
//   '/payments/failure',
//   authMiddleware,
//   billingController.handlePaymentFailure.bind(billingController)
// );

// router.post(
//   '/professional/clients',
//   authMiddleware,
//   requireAuth(['professional']),
//   validationMiddleware(professionalClientSchema),
//   billingController.createProfessionalClient.bind(billingController)
// );

// router.get(
//   '/subscriptions/:entityId/:planType/status',
//   authMiddleware,
//   billingController.getSubscriptionStatus.bind(billingController)
// );

// router.delete(
//   '/subscriptions/:subscriptionId',
//   authMiddleware,
//   billingController.cancelSubscription.bind(billingController)
// );

// router.get(
//   '/subscriptions/:subscriptionId/payments',
//   authMiddleware,
//   billingController.getSubscriptionPayments.bind(billingController)
// );

// export default router;
