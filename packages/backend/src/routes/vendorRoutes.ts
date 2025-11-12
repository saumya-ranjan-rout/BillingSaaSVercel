// packages/backend/src/routes/vendorRoutes.ts
import { Router } from 'express';
import { VendorController } from '../controllers/VendorController';
import { VendorService } from '../services/vendor/VendorService';
import { CacheService } from '../services/cache/CacheService';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { rbacMiddleware } from '../middleware/rbac';
import { validationMiddleware } from '../middleware/validation';
import { vendorSchema } from '../utils/validators';
import { cacheMiddleware } from '../middleware/cache';
import { checkSubscription } from '../middleware/checkSubscription';

const router = Router();

// Initialize service and controller
const vendorService = new VendorService();
const cacheService = new CacheService();
const vendorController = new VendorController(vendorService,cacheService);

// ✅ Apply authentication + tenant context to all routes
router.use(authMiddleware, tenantMiddleware, checkSubscription);

// ----------------- Vendor CRUD -----------------
router.post(
  '/',
  rbacMiddleware(['create:vendors']),
  validationMiddleware(vendorSchema),
  vendorController.createVendor.bind(vendorController)
);

router.get(
  '/',
  rbacMiddleware(['read:vendors']),
  cacheMiddleware('3 minutes'), // vendor list may change, but not too frequently
  vendorController.getVendors.bind(vendorController)
);

router.get(
  '/search',
  rbacMiddleware(['read:vendors']),
  cacheMiddleware('2 minutes'), // search queries change more often
  vendorController.searchVendors.bind(vendorController)
);

router.get(
  '/:id',
  rbacMiddleware(['read:vendors']),
  cacheMiddleware('5 minutes'), // individual vendor rarely changes
  vendorController.getVendor.bind(vendorController)
);

router.put(
  '/:id',
  rbacMiddleware(['update:vendors']),
  validationMiddleware(vendorSchema),
  vendorController.updateVendor.bind(vendorController)
);

router.delete(
  '/:id',
  rbacMiddleware(['delete:vendors']),
  vendorController.deleteVendor.bind(vendorController)
);

export default router;


