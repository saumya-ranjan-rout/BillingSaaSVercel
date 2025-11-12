import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';

const router = Router();
const subscriptionController = new SubscriptionController();

// Initialize default plans
router.get('/plans/init', async (req, res) => {
  const subscriptionService = new (await import('../services/subscription/SubscriptionService')).SubscriptionService();
  await subscriptionService.initializeDefaultPlans();
  res.json({ message: 'Default plans initialized' });
});

router.get('/plans', subscriptionController.getPlans.bind(subscriptionController));
router.get('/current', authMiddleware, subscriptionController.getCurrentSubscription.bind(subscriptionController));
router.get('/check-access', authMiddleware, subscriptionController.checkAccess.bind(subscriptionController));
router.get('/stats', authMiddleware, tenantMiddleware, subscriptionController.getStats.bind(subscriptionController));

router.post('/subscribe', authMiddleware, subscriptionController.createSubscription.bind(subscriptionController));
router.post('/payment/success', authMiddleware, subscriptionController.handlePaymentSuccess.bind(subscriptionController));
router.post('/payment/failure', authMiddleware, subscriptionController.handlePaymentFailure.bind(subscriptionController));
router.post('/cancel', authMiddleware, subscriptionController.cancelSubscription.bind(subscriptionController));

export default router;
