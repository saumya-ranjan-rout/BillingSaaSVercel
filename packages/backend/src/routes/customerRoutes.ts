// packages/backend/src/routes/customerRoutes.ts
import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { CustomerService } from '../services/customer/CustomerService';
import { CacheService } from '../services/cache/CacheService';
import { AuthService } from '../services/auth/AuthService';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { rbacMiddleware } from '../middleware/rbac';
import { validationMiddleware } from '../middleware/validation';
import { customerSchema } from '../utils/validators';
import { cacheMiddleware } from '../middleware/cache'; // ✅ added
import { checkSubscription } from '../middleware/checkSubscription';  // ✅ added
import { switchTenantMiddleware } from "../middleware/switchTenantMiddleware";


const router = Router();
const customerService = new CustomerService();
const cacheService = new CacheService();
const authService = new AuthService();
const customerController = new CustomerController(customerService, cacheService, authService);

// ✅ All routes require authentication and tenant context
router.use(authMiddleware, tenantMiddleware, checkSubscription);

// ----------------- Create -----------------
router.post(
  '/',
  rbacMiddleware(['create:customers']),
  validationMiddleware(customerSchema),
  customerController.createCustomer.bind(customerController)
);

// ----------------- Read (cached) -----------------
router.get(
  '/',
  rbacMiddleware(['read:customers']),
  cacheMiddleware('5 minutes'),
  customerController.getCustomers.bind(customerController)
);

router.get(
  '/search',
  rbacMiddleware(['read:customers']),
  cacheMiddleware('2 minutes'), // search results can change quickly
  customerController.searchCustomers.bind(customerController)
);

router.get(
  '/:id',
  rbacMiddleware(['read:customers']),
  cacheMiddleware('10 minutes'), // individual customer rarely changes
  customerController.getCustomer.bind(customerController)
);

// ----------------- Update -----------------
router.put(
  '/:id',
  rbacMiddleware(['update:customers']),
  validationMiddleware(customerSchema),
  customerController.updateCustomer.bind(customerController)
);

// ----------------- Delete -----------------
router.delete(
  '/:id',
  rbacMiddleware(['delete:customers']),
  customerController.deleteCustomer.bind(customerController)
);

// ----------------- Switch Tenant -----------------
// router.put(
//   '/switch-tenant/:tenantId',
//   rbacMiddleware(['update:users']),
//   customerController.updateUser.bind(customerController)
// );
// router.post('/switch-tenant', customerController.switchTenant.bind(customerController));
router.get(

  '/switchTenant/:id/:role',

  customerController.switchTenant.bind(customerController)

);

export default router;



// import { Router } from 'express';
// import { CustomerController } from '../controllers/CustomerController';
// import { CustomerService } from '../services/customer/CustomerService';
// import { CacheService } from '../services/cache/CacheService';
// import { authMiddleware } from '../middleware/auth';
// import { tenantMiddleware } from '../middleware/tenant';
// import { rbacMiddleware } from '../middleware/rbac';
// import { validationMiddleware } from '../middleware/validation';
// import { customerSchema } from '../utils/validators';

// const router = Router();
// const customerService = new CustomerService();
// const cacheService = new CacheService();
// const customerController = new CustomerController(customerService, cacheService);

// // All routes require authentication and tenant context
// router.use(authMiddleware, tenantMiddleware);
// // console.log("Inside customerRoutes");
// router.post(
//   '/',
//   rbacMiddleware(['create:customers']),
//   validationMiddleware(customerSchema),
//   customerController.createCustomer.bind(customerController)
// );

// router.get(
//   '/',
//   rbacMiddleware(['read:customers']),
//   customerController.getCustomers.bind(customerController)
// );

// router.get(
//   '/search',
//   rbacMiddleware(['read:customers']),
//   customerController.searchCustomers.bind(customerController)
// );

// router.get(
//   '/:id',
//   rbacMiddleware(['read:customers']),
//   customerController.getCustomer.bind(customerController)
// );

// router.put(
//   '/:id',
//   rbacMiddleware(['update:customers']),
//   validationMiddleware(customerSchema),
//   customerController.updateCustomer.bind(customerController)
// );

// router.delete(
//   '/:id',
//   rbacMiddleware(['delete:customers']),
//   customerController.deleteCustomer.bind(customerController)
// );

// export default router;
