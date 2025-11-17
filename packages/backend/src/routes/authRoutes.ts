import { Router, Request, Response } from 'express'; 
import { TenantController } from '../controllers/TenantController';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { validationMiddleware } from '../middleware/validation';
import { createTenantSchema, updateTenantSchema } from '../utils/validators';


// Services
import { TenantService } from '../services/tenant/TenantService';
import { TenantProvisioningService } from '../services/tenant/TenantProvisioningService';
import { AuthService } from '../services/auth/AuthService';
import { CacheService } from '../services/cache/CacheService'; // 👈 add this

// Import your existing cache middleware
import { cacheMiddleware } from '../middleware/cache';
import validateLicenseRouter from "../middleware/validateLicense";
import { auth } from 'firebase-admin';

const router = Router();

// Instantiate services
const tenantService = new TenantService();
const provisioningService = new TenantProvisioningService();
const authService = new AuthService();
const cacheService = new CacheService(); // 👈 new instance

// Pass services into controllers
const tenantController = new TenantController(tenantService, provisioningService, cacheService);
const authController = new AuthController(authService);

// Routes (no cache for login or POSTs)
router.post('/login', authController.login.bind(authController));

router.post('/super-user-login', authController.superUserlogin.bind(authController));
// router.post('/login', (req: Request, res: Response, next) => {
//   console.log('🔥 /login route is being hit!');
//   next(); // continue to controller
// }, authController.login.bind(authController));
router.post('/enable-biometric', authMiddleware, authController.enableBiometric.bind(authController));
router.post('/biometric/enable', authMiddleware, authController.enableBiometric.bind(authController));
router.post('/register', authController.registerWithTenant.bind(authController));
router.use("/validate-license", validateLicenseRouter);
router.get(
  '/all-tenants',
  cacheMiddleware('5 minutes'),
  authController.getTenants.bind(authController)  // Call the controller method to fetch tenants
);
// Cached GET route for tenants by email
router.get(
  '/tenants/:email',
  cacheMiddleware('2m'),   // cache result for 2 minutes
  authController.getTenantsForUser.bind(authController)
);

// Public routes
router.get('/me', authMiddleware, (req: Request, res: Response) => {
  if (!req.user) {
  
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  //  console.log('auth routes:',req.user);
  res.json({ success: true, user: req.user });
});

router.get(
  '/mewithtenant',
  authMiddleware,   // cache result for 2 minutes
  authController.meWithTenant.bind(authController)
);

router.post(
  '/',
  validationMiddleware(createTenantSchema),
  tenantController.createTenant.bind(tenantController)
);

// Protected routes
router.get(
  '/',
  authMiddleware,
  tenantMiddleware,
  cacheMiddleware('3m'),   // cache tenant details for 3 minutes
  tenantController.getTenantDetails.bind(tenantController)
);

router.put(
  '/',
  authMiddleware,
  tenantMiddleware,
  validationMiddleware(updateTenantSchema),
  tenantController.updateTenant.bind(tenantController)
);

export default router;



// import { Router } from 'express';
// import { TenantController } from '../controllers/TenantController';
// import { authMiddleware } from '../middleware/auth';
// import { tenantMiddleware } from '../middleware/tenant';
// import { validationMiddleware } from '../middleware/validation';
// import { createTenantSchema, updateTenantSchema } from '../utils/validators';



// import { AuthController } from '../controllers/AuthController';
// //from '../controllers/auth.controller';
// import { authenticateToken } from '../middleware/auth.middleware';

// const router = Router();
// const tenantController = new TenantController(
//   // These would be injected via dependency injection
// );
// const authController = new AuthController();


// router.post('/login', authController.login);
// router.post('/enable-biometric', authenticateToken, authController.enableBiometric);
// router.get('/tenants/:email', authController.getTenantsForUser);
// router.post('/biometric/enable', authenticateToken, authController.enableBiometric);

// // Public routes
// router.post(
//   '/',
//   validationMiddleware(createTenantSchema),
//   tenantController.createTenant.bind(tenantController)
// );

// // Protected routes (require authentication and tenant context)
// router.get(
//   '/',
//   authMiddleware,
//   tenantMiddleware,
//   tenantController.getTenantDetails.bind(tenantController)
// );

// router.put(
//   '/',
//   authMiddleware,
//   tenantMiddleware,
//   validationMiddleware(updateTenantSchema),
//   tenantController.updateTenant.bind(tenantController)
// );

// export default router;
