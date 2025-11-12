import { Router } from 'express';
import { TenantOnboardingController } from '../controllers/TenantOnboardingController';
import { ProfessionalOnboardingController } from '../controllers/ProfessionalOnboardingController';
import { authenticate } from '../middleware/authenticate';
import { professionalAuth } from '../middleware/professionalAuth';
import { cacheMiddleware } from '../middleware/cache'; // ✅ add cache

const router = Router();

// Tenant self-onboarding routes
router.get(
  '/subscription-plans',
  cacheMiddleware('5m'), // ✅ plans rarely change, safe to cache longer
  TenantOnboardingController.getSubscriptionPlans
);

router.post(
  '/tenant',
  TenantOnboardingController.createTenantWithSubscription
);

// Professional onboarding routes
router.post(
  '/professional/onboard-tenant',
  authenticate,
  professionalAuth,
  ProfessionalOnboardingController.onboardTenant
);

router.get(
  '/professional/subscriptions',
  authenticate,
  professionalAuth,
  cacheMiddleware('2m'), // ✅ short cache for professional subscriptions
  ProfessionalOnboardingController.getProfessionalSubscriptions
);

export default router;


// import { Router } from 'express';
// import { TenantOnboardingController } from '../controllers/TenantOnboardingController';
// import { ProfessionalOnboardingController } from '../controllers/ProfessionalOnboardingController';
// import { authenticate } from '../middleware/authenticate';
// import { professionalAuth } from '../middleware/professionalAuth';

// const router = Router();

// // Tenant self-onboarding routes
// router.get('/subscription-plans', TenantOnboardingController.getSubscriptionPlans);
// router.post('/tenant', TenantOnboardingController.createTenantWithSubscription);

// // Professional onboarding routes
// router.post('/professional/onboard-tenant', authenticate, professionalAuth, ProfessionalOnboardingController.onboardTenant);
// router.get('/professional/subscriptions', authenticate, professionalAuth, ProfessionalOnboardingController.getProfessionalSubscriptions);

// export default router;
