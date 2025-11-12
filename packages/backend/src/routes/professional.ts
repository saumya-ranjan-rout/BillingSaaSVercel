import { Router } from 'express';
import { ProfessionalController } from '../controllers/ProfessionalController';
import { GSTFilingController } from '../controllers/GSTFilingController';
import { authenticate } from '../middleware/authenticate';
import { professionalAuth } from '../middleware/professionalAuth';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

// Professional management routes
router.post(
  '/professionals/register',
  ProfessionalController.registerProfessional
);

router.get(
  '/professionals/dashboard',
  authenticate,
  professionalAuth,
  cacheMiddleware('2m'), // dashboard data changes frequently
  ProfessionalController.getDashboard
);

router.get(
  '/professionals/tenants',
  authenticate,
  professionalAuth,
  cacheMiddleware('5m'), // tenant list less volatile
  ProfessionalController.getManagedTenants
);

router.post(
  '/professionals/tenants/:tenantId',
  authenticate,
  professionalAuth,
  ProfessionalController.assignToTenant
);

// GST filing routes
router.get(
  '/gst/returns/:type',
  authenticate,
  professionalAuth,
  cacheMiddleware('5m'), // returns data can be cached briefly
  GSTFilingController.getReturn
);

router.post(
  '/gst/returns/:type/file',
  authenticate,
  professionalAuth,
  GSTFilingController.fileReturn
);

router.get(
  '/gst/filing-history',
  authenticate,
  professionalAuth,
  cacheMiddleware('10m'), // history less frequently updated
  GSTFilingController.getFilingHistory
);

router.get(
  '/gst/compliance-calendar',
  authenticate,
  professionalAuth,
  cacheMiddleware('30m'), // calendar data changes rarely
  GSTFilingController.getComplianceCalendar
);

export default router;


// import { Router } from 'express';
// import { ProfessionalController } from '../controllers/ProfessionalController';
// import { GSTFilingController } from '../controllers/GSTFilingController';
// import { authenticate } from '../middleware/authenticate';
// import { professionalAuth } from '../middleware/professionalAuth';

// const router = Router();

// // Professional management routes
// router.post('/professionals/register', ProfessionalController.registerProfessional);
// router.get('/professionals/dashboard', authenticate, professionalAuth, ProfessionalController.getDashboard);
// router.get('/professionals/tenants', authenticate, professionalAuth, ProfessionalController.getManagedTenants);
// router.post('/professionals/tenants/:tenantId', authenticate, professionalAuth, ProfessionalController.assignToTenant);

// // GST filing routes
// router.get('/gst/returns/:type', authenticate, professionalAuth, GSTFilingController.getReturn);
// router.post('/gst/returns/:type/file', authenticate, professionalAuth, GSTFilingController.fileReturn);
// router.get('/gst/filing-history', authenticate, professionalAuth, GSTFilingController.getFilingHistory);
// router.get('/gst/compliance-calendar', authenticate, professionalAuth, GSTFilingController.getComplianceCalendar);

// export default router;
