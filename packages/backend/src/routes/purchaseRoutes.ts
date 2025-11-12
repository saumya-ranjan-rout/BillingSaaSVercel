// packages/backend/src/routes/purchaseRoutes.ts
import { Router } from 'express';
import { PurchaseController } from '../controllers/PurchaseController';
import { PurchaseService } from '../services/purchases/PurchaseService';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { rbacMiddleware } from '../middleware/rbac';
import { validationMiddleware } from '../middleware/validation';
import { purchaseOrderSchema } from '../utils/validators';
import { cacheMiddleware } from '../middleware/cache'; // ✅ added
import { checkSubscription } from '../middleware/checkSubscription';  // ✅ added

const router = Router();
const purchaseService = new PurchaseService();
const purchaseController = new PurchaseController(purchaseService);

// ✅ All routes require authentication and tenant context
router.use(authMiddleware, tenantMiddleware, checkSubscription);

// ----------------- Create -----------------
router.post(
  '/',
  rbacMiddleware(['create:purchases']),
  validationMiddleware(purchaseOrderSchema),
  purchaseController.createPurchaseOrder.bind(purchaseController)
);

// ----------------- Read (cached) -----------------
router.get(
  '/',
  rbacMiddleware(['read:purchases']),
  cacheMiddleware('3 minutes'), // list can change frequently
  purchaseController.getPurchaseOrders.bind(purchaseController)
);

router.get(
  '/summary',
  rbacMiddleware(['read:purchases']),
  cacheMiddleware('2 minutes'), // summary should refresh quickly
  purchaseController.getPurchaseOrderSummary.bind(purchaseController)
);

router.get(
  '/vendor/:vendorId',
  rbacMiddleware(['read:purchases']),
  cacheMiddleware('5 minutes'), // vendor-specific purchases less volatile
  purchaseController.getVendorPurchaseOrders.bind(purchaseController)
);

router.get(
  '/:id',
  rbacMiddleware(['read:purchases']),
  cacheMiddleware('10 minutes'), // individual purchase order rarely changes
  purchaseController.getPurchaseOrder.bind(purchaseController)
);

// ----------------- Update -----------------
router.put(
  '/:id',
  rbacMiddleware(['update:purchases']),
  validationMiddleware(purchaseOrderSchema),
  purchaseController.updatePurchaseOrder.bind(purchaseController)
);

router.patch(
  '/:id/status',
  rbacMiddleware(['update:purchases']),
  purchaseController.updatePurchaseOrderStatus.bind(purchaseController)
);

// ----------------- Delete -----------------
router.delete(
  '/:id',
  rbacMiddleware(['delete:purchases']),
  purchaseController.deletePurchaseOrder.bind(purchaseController)
);

export default router;



// import { Router } from 'express';
// import { PurchaseController } from '../controllers/PurchaseController';
// import { PurchaseService } from '../services/purchases/PurchaseService';
// import { authMiddleware } from '../middleware/auth';
// import { tenantMiddleware } from '../middleware/tenant';
// import { rbacMiddleware } from '../middleware/rbac';
// import { validationMiddleware } from '../middleware/validation';
// import { purchaseOrderSchema } from '../utils/validators';

// const router = Router();
// const purchaseService = new PurchaseService();
// const purchaseController = new PurchaseController(purchaseService);

// // All routes require authentication and tenant context
// router.use(authMiddleware, tenantMiddleware);

// router.post(
//   '/',
//   rbacMiddleware(['create:purchases']),
//   validationMiddleware(purchaseOrderSchema),
//   purchaseController.createPurchaseOrder.bind(purchaseController)
// );

// router.get(
//   '/',
//   rbacMiddleware(['read:purchases']),
//   purchaseController.getPurchaseOrders.bind(purchaseController)
// );

// router.get(
//   '/summary',
//   rbacMiddleware(['read:purchases']),
//   purchaseController.getPurchaseOrderSummary.bind(purchaseController)
// );

// router.get(
//   '/vendor/:vendorId',
//   rbacMiddleware(['read:purchases']),
//   purchaseController.getVendorPurchaseOrders.bind(purchaseController)
// );

// router.get(
//   '/:id',
//   rbacMiddleware(['read:purchases']),
//   purchaseController.getPurchaseOrder.bind(purchaseController)
// );

// router.put(
//   '/:id',
//   rbacMiddleware(['update:purchases']),
//   validationMiddleware(purchaseOrderSchema),
//   purchaseController.updatePurchaseOrder.bind(purchaseController)
// );

// router.patch(
//   '/:id/status',
//   rbacMiddleware(['update:purchases']),
//   purchaseController.updatePurchaseOrderStatus.bind(purchaseController)
// );

// router.delete(
//   '/:id',
//   rbacMiddleware(['delete:purchases']),
//   purchaseController.deletePurchaseOrder.bind(purchaseController)
// );

// export default router;
