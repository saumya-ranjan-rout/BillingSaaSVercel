// packages/backend/src/routes/reportRoutes.ts
import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { ReportService } from '../services/report/ReportService';
import { CacheService } from '../services/cache/CacheService';
import { QueueService } from '../services/queue/QueueService';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { rbacMiddleware } from '../middleware/rbac';
import { validationMiddleware } from '../middleware/validation';
import { reportGenerationSchema } from '../utils/validators';
import { cacheMiddleware } from '../middleware/cache'; // ✅ added
import { checkSubscription } from '../middleware/checkSubscription';  // ✅ added

const router = Router();

// Initialize services and controller
const reportService = new ReportService();
const reportController = new ReportController(
  reportService,
  new QueueService(),
  new CacheService()
);

// ✅ Apply authentication and tenant middleware to all routes
router.use(authMiddleware, tenantMiddleware, checkSubscription);

// ----------------- Generate Reports (no cache) -----------------
router.post(
  '/generate',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateReport.bind(reportController)
);

// ----------------- Read Reports (cached) -----------------
router.get(
  '/history',
  rbacMiddleware(['read:reports']),
  cacheMiddleware('2 minutes'), // history changes often
  reportController.getReportHistory.bind(reportController)
);

router.get(
  '/:id',
  rbacMiddleware(['read:reports']),
  cacheMiddleware('5 minutes'), // report details change less often
  reportController.getReportById.bind(reportController)
);

router.get(
  '/:id/download',
  rbacMiddleware(['read:reports']),
  cacheMiddleware('15 minutes'), // report file rarely changes
  reportController.downloadReport.bind(reportController)
);

router.get(
  '/:id/data',
  rbacMiddleware(['read:reports']),
  cacheMiddleware('3 minutes'), // preview may change
  reportController.getReportData.bind(reportController)
);

// ----------------- Delete Report -----------------
router.delete(
  '/:id',
  rbacMiddleware(['delete:reports']),
  reportController.deleteReport.bind(reportController)
);

// ----------------- Specific Report Generations (no cache) -----------------
router.post(
  '/gstr1',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateGSTR1.bind(reportController)
);

router.post(
  '/gstr3b',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateGSTR3B.bind(reportController)
);

router.post(
  '/sales-register',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateSalesRegister.bind(reportController)
);

router.post(
  '/purchase-register',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generatePurchaseRegister.bind(reportController)
);

router.post(
  '/hsn-summary',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateHSNSummary.bind(reportController)
);

router.post(
  '/tds',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateTDSReport.bind(reportController)
);

router.post(
  '/audit-trail',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateAuditTrail.bind(reportController)
);

router.post(
  '/profit-loss',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateProfitLoss.bind(reportController)
);

router.post(
  '/balance-sheet',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateBalanceSheet.bind(reportController)
);

router.post(
  '/cash-bank-book',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateCashBankBook.bind(reportController)
);

router.post(
  '/ledger-report',
  rbacMiddleware(['generate:reports']),
  validationMiddleware(reportGenerationSchema),
  reportController.generateLedgerReport.bind(reportController)
);

export default router;


// import { Router } from 'express';
// import { ReportController } from '../controllers/ReportController';
// import { ReportService } from '../services/report/ReportService';
// import { CacheService } from '../services/cache/CacheService';
// import { QueueService } from '../services/queue/QueueService';
// import { authMiddleware } from '../middleware/auth';
// import { tenantMiddleware } from '../middleware/tenant';
// import { rbacMiddleware } from '../middleware/rbac';
// import { validationMiddleware } from '../middleware/validation';
// import { reportGenerationSchema } from '../utils/validators';

// const router = Router();

// // Initialize services and controller
// const reportService = new ReportService();
// const reportController = new ReportController(reportService, new QueueService(), new CacheService());

// // Apply authentication and tenant middleware to all routes
// router.use(authMiddleware, tenantMiddleware);

// /**
//  * @route POST /api/reports/generate
//  * @description Generate a new report
//  * @access Private (Requires generate:reports permission)
//  */
// router.post(
//   '/generate',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateReport.bind(reportController)
// );

// /**
//  * @route GET /api/reports/history
//  * @description Get report generation history
//  * @access Private (Requires read:reports permission)
//  */
// router.get(
//   '/history',
//   rbacMiddleware(['read:reports']),
//   reportController.getReportHistory.bind(reportController)
// );

// /**
//  * @route GET /api/reports/:id
//  * @description Get report details by ID
//  * @access Private (Requires read:reports permission)
//  */
// router.get(
//   '/:id',
//   rbacMiddleware(['read:reports']),
//   reportController.getReportById.bind(reportController)
// );

// /**
//  * @route GET /api/reports/:id/download
//  * @description Download generated report file
//  * @access Private (Requires read:reports permission)
//  */
// router.get(
//   '/:id/download',
//   rbacMiddleware(['read:reports']),
//   reportController.downloadReport.bind(reportController)
// );

// /**
//  * @route GET /api/reports/:id/data
//  * @description Get report data (for preview)
//  * @access Private (Requires read:reports permission)
//  */
// router.get(
//   '/:id/data',
//   rbacMiddleware(['read:reports']),
//   reportController.getReportData.bind(reportController)
// );

// /**
//  * @route DELETE /api/reports/:id
//  * @description Delete a report
//  * @access Private (Requires delete:reports permission)
//  */
// router.delete(
//   '/:id',
//   rbacMiddleware(['delete:reports']),
//   reportController.deleteReport.bind(reportController)
// );

// // Specific report type endpoints
// router.post(
//   '/gstr1',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateGSTR1.bind(reportController)
// );

// router.post(
//   '/gstr3b',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateGSTR3B.bind(reportController)
// );

// router.post(
//   '/sales-register',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateSalesRegister.bind(reportController)
// );

// router.post(
//   '/purchase-register',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generatePurchaseRegister.bind(reportController)
// );

// router.post(
//   '/hsn-summary',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateHSNSummary.bind(reportController)
// );

// router.post(
//   '/tds',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateTDSReport.bind(reportController)
// );

// router.post(
//   '/audit-trail',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateAuditTrail.bind(reportController)
// );

// router.post(
//   '/profit-loss',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateProfitLoss.bind(reportController)
// );

// router.post(
//   '/balance-sheet',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateBalanceSheet.bind(reportController)
// );

// router.post(
//   '/cash-bank-book',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateCashBankBook.bind(reportController)
// );

// router.post(
//   '/ledger-report',
//   rbacMiddleware(['generate:reports']),
//   validationMiddleware(reportGenerationSchema),
//   reportController.generateLedgerReport.bind(reportController)
// );

// export default router;
