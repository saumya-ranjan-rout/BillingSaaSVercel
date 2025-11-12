import { Router } from 'express';
import { LoyaltyController } from '../controllers/LoyaltyController';
import { LoyaltyService } from '../services/loyalty/LoyaltyService';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { validationMiddleware } from '../middleware/validation';
import { 
  redeemCashbackSchema, 
  updateProgramSchema,
  calculateCashbackSchema
} from '../utils/validators';
import { cacheMiddleware } from '../middleware/cache'; // ✅ add cache
import { checkSubscription } from '../middleware/checkSubscription';

const router = Router();
const loyaltyService = new LoyaltyService();
const loyaltyController = new LoyaltyController(loyaltyService);

// All routes require authentication and tenant context
router.use(authMiddleware, tenantMiddleware, checkSubscription);

router.post(
  '/process-invoice/:invoiceId',
  loyaltyController.processInvoice.bind(loyaltyController)
);

router.post(
  '/redeem-cashback',
  validationMiddleware(redeemCashbackSchema),
  loyaltyController.redeemCashback.bind(loyaltyController)
);

// ✅ Cached (customer summary doesn’t change every second, 3 minutes cache is safe)
router.get(
  '/customer/:customerId/summary',
  cacheMiddleware('3m'),
  loyaltyController.getCustomerSummary.bind(loyaltyController)
);

router.put(
  '/program/:programId',
  validationMiddleware(updateProgramSchema),
  loyaltyController.updateProgram.bind(loyaltyController)
);

// ✅ Cached (program stats usually aggregate data, safe to cache for 5 minutes)
router.get(
  '/program/:programId/stats',
  cacheMiddleware('5m'),
  loyaltyController.getProgramStats.bind(loyaltyController)
);

router.post(
  '/calculate-cashback',
  validationMiddleware(calculateCashbackSchema),
  loyaltyController.calculateCashback.bind(loyaltyController)
);

// ✅ Cached (active program doesn’t change too frequently, cache 10 minutes)
router.get(
  '/program',
  cacheMiddleware('10m'),
  loyaltyController.getActiveProgram.bind(loyaltyController)
);

export default router;


// import { Router } from 'express';
// import { LoyaltyController } from '../controllers/LoyaltyController';
// import { LoyaltyService } from '../services/loyalty/LoyaltyService';
// import { authMiddleware } from '../middleware/auth';
// import { tenantMiddleware } from '../middleware/tenant';
// import { validationMiddleware } from '../middleware/validation';
// import { 
//   redeemCashbackSchema, 
//   updateProgramSchema,
//   calculateCashbackSchema
// } from '../utils/validators';

// const router = Router();
// const loyaltyService = new LoyaltyService();
// const loyaltyController = new LoyaltyController(loyaltyService);

// // All routes require authentication and tenant context
// router.use(authMiddleware, tenantMiddleware);

// router.post(
//   '/process-invoice/:invoiceId',
//   loyaltyController.processInvoice.bind(loyaltyController)
// );

// router.post(
//   '/redeem-cashback',
//   validationMiddleware(redeemCashbackSchema),
//   loyaltyController.redeemCashback.bind(loyaltyController)
// );

// router.get(
//   '/customer/:customerId/summary',
//   loyaltyController.getCustomerSummary.bind(loyaltyController)
// );

// router.put(
//   '/program/:programId',
//   validationMiddleware(updateProgramSchema),
//   loyaltyController.updateProgram.bind(loyaltyController)
// );

// router.get(
//   '/program/:programId/stats',
//   loyaltyController.getProgramStats.bind(loyaltyController)
// );

// router.post(
//   '/calculate-cashback',
//   validationMiddleware(calculateCashbackSchema),
//   loyaltyController.calculateCashback.bind(loyaltyController)
// );
// router.get(
//   '/program',
//   loyaltyController.getActiveProgram.bind(loyaltyController)
// );

// export default router;
