// packages/backend/src/routes/superAdminRoutes.ts
import { Router } from 'express';
import { SuperAdminController } from '../controllers/SuperAdminController';
import { authMiddleware } from '../middleware/auth';
import { superAdminAuth } from '../middleware/superAdminAuth';
import { cacheMiddleware } from '../middleware/cache'; // ✅ added

const router = Router();

// ✅ All routes require super admin authentication
router.use(authMiddleware, superAdminAuth);

// ----------------- Dashboard (cached) -----------------
router.get(
  '/dashboard',
  cacheMiddleware('2 minutes'), // dashboard updates frequently
  SuperAdminController.getDashboard
);

// ----------------- Data Management (cached) -----------------
router.get(
  '/users',
  cacheMiddleware('5 minutes'),
  SuperAdminController.getUsers
);
router.post('/users', SuperAdminController.createUser);
router.put('/users/:id', SuperAdminController.updateUser);
router.get('/users/:id', SuperAdminController.getUserById);
router.patch('/users/:id/status', SuperAdminController.updateUserStatus);

router.get(
  '/tenants',
  cacheMiddleware('5 minutes'),
  SuperAdminController.getTenants
);
router.post('/tenants', SuperAdminController.createTenant);
router.put('/tenants/:id', SuperAdminController.updateTenant);

router.patch('/tenants/:id/status', SuperAdminController.updateTenantStatus);

router.get(
  '/professionals',
  cacheMiddleware('5 minutes'),
  SuperAdminController.getProfessionals
);
router.post(
  '/professionals',
  SuperAdminController.createProfessional // Create a new professional
);

router.put(
  '/professionals/:id',
  SuperAdminController.updateProfessional // Update an existing professional
);

router.patch('/professionals/:id/:userId/status', SuperAdminController.updateProfessionalStatus);

router.get(
  '/audit-logs',
  cacheMiddleware('2 minutes'),
  SuperAdminController.getAuditLogs
);

// ----------------- Export (cached) -----------------
router.get(
  '/export/:resource/:format',
  cacheMiddleware('4 minutes'), // exports can be heavy
  SuperAdminController.exportData
);

router.get('/subscriptions', SuperAdminController.getSubscriptions);
// ----------------- Status Updates (no cache) -----------------



export default router;



// import { Router } from 'express';
// import { SuperAdminController } from '../controllers/SuperAdminController';
// import { authenticate } from '../middleware/authenticate';
// import { superAdminAuth } from '../middleware/superAdminAuth';

// const router = Router();

// // All routes require super admin authentication
// router.use(authenticate, superAdminAuth);

// // Dashboard routes
// router.get('/dashboard', SuperAdminController.getDashboard);

// // Data management routes
// router.get('/users', SuperAdminController.getUsers);
// router.get('/tenants', SuperAdminController.getTenants);
// router.get('/professionals', SuperAdminController.getProfessionals);
// router.get('/audit-logs', SuperAdminController.getAuditLogs);

// // Export routes
// router.get('/export/:resource/:format', SuperAdminController.exportData);

// // Status update routes
// router.patch('/users/:id/status', SuperAdminController.updateUserStatus);
// router.patch('/tenants/:id/status', SuperAdminController.updateTenantStatus);
// router.patch('/professionals/:id/status', SuperAdminController.updateProfessionalStatus);

// export default router;
