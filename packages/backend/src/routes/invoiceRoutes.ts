import { Router, Request, Response } from "express";
import { InvoiceController } from '../controllers/InvoiceController';
import { InvoiceService } from '../services/invoice/InvoiceService';
import { SettingService } from '../services/SettingService';
import { CacheService } from '../services/cache/CacheService';
import { QueueService } from '../services/queue/QueueService';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { rbacMiddleware } from '../middleware/rbac';
import { validationMiddleware } from '../middleware/validation';
import { invoiceSchema, paymentSchema } from '../utils/validators';
import { cacheMiddleware } from "../middleware/cache";  // ✅ add import
import { checkSubscription } from "../middleware/checkSubscription";

const router = Router();
const invoiceService = new InvoiceService();
const settingService = new SettingService();
const cacheService = new CacheService();
const queueService = new QueueService();

const invoiceController = new InvoiceController(
  invoiceService,
  settingService,
  cacheService,
  queueService
);

// All routes require authentication and tenant context
router.use(authMiddleware, tenantMiddleware, checkSubscription);

router.post(
  '/',
  rbacMiddleware(['create:invoices']),
  validationMiddleware(invoiceSchema),
  invoiceController.createInvoice.bind(invoiceController)
);

router.put(
  '/:id',
  rbacMiddleware(['update:invoices']),
  validationMiddleware(invoiceSchema),
  invoiceController.updateInvoice.bind(invoiceController)
);

// ✅ Cache GET requests
router.get(
  '/',
  rbacMiddleware(['read:invoices']),
  cacheMiddleware("2m"),
  invoiceController.getInvoices.bind(invoiceController)
);

router.get(
  '/summary',
  rbacMiddleware(['read:invoices']),
  cacheMiddleware("5m"),
  invoiceController.getInvoiceSummary.bind(invoiceController)
);

router.get(
  '/overdue',
  rbacMiddleware(['read:invoices']),
  cacheMiddleware("2m"),
  invoiceController.getOverdueInvoices.bind(invoiceController)
);

router.get(
  '/customer/:customerId',
  rbacMiddleware(['read:invoices']),
  cacheMiddleware("2m"),
  invoiceController.getCustomerInvoices.bind(invoiceController)
);

router.get(
  '/:id',
  rbacMiddleware(['read:invoices']),
  cacheMiddleware("2m"),
  invoiceController.getInvoice.bind(invoiceController)
);

router.patch(
  '/:id/status',
  rbacMiddleware(['update:invoices']),
  invoiceController.updateInvoiceStatus.bind(invoiceController)
);

router.post(
  '/:id/send',
  rbacMiddleware(['update:invoices']),
  invoiceController.sendInvoice.bind(invoiceController)
);

router.post(
  '/payments',
  rbacMiddleware(['create:payments']),
  validationMiddleware(paymentSchema),
  invoiceController.addPayment.bind(invoiceController)
);

router.delete(
  '/:id',
  rbacMiddleware(['delete:invoices']),
  invoiceController.deleteInvoice.bind(invoiceController)
);

// ✅ Reports can also be cached
router.get(
  "/reports/sales",
  cacheMiddleware("10m"),
  invoiceController.getSalesReport
);

router.get(
  "/reports/gstr1",
  cacheMiddleware("10m"),
  invoiceController.getGSTR1Report
);

router.get(
  '/:id/pdf',
  rbacMiddleware(['read:invoices']),
  cacheMiddleware("5m"),
  invoiceController.getInvoicePDF.bind(invoiceController)
);

export default router;



// import { Router, Request, Response } from "express";
// import { InvoiceController } from '../controllers/InvoiceController';
// import { InvoiceService } from '../services/invoice/InvoiceService';
// import { SettingService } from '../services/SettingService';
// import { CacheService } from '../services/cache/CacheService';
// import { QueueService } from '../services/queue/QueueService';
// import { authMiddleware } from '../middleware/auth';
// import { tenantMiddleware } from '../middleware/tenant';
// import { rbacMiddleware } from '../middleware/rbac';
// import { validationMiddleware } from '../middleware/validation';
// import { invoiceSchema, paymentSchema } from '../utils/validators';
// import { Tenant } from "../entities/Tenant"; // adjust path

// const router = Router();
// const invoiceService = new InvoiceService();
// // const invoiceController = new InvoiceController(invoiceService);
// const settingService = new SettingService();
// const cacheService = new CacheService();
// const queueService = new QueueService();

// const invoiceController = new InvoiceController(invoiceService,settingService,cacheService,queueService); // pass settingService


// // All routes require authentication and tenant context
// router.use(authMiddleware, tenantMiddleware);

// router.post(
//   '/',
//   rbacMiddleware(['create:invoices']),
//   validationMiddleware(invoiceSchema),
//   invoiceController.createInvoice.bind(invoiceController)
// );

// router.put(
//   '/:id',
//   rbacMiddleware(['update:invoices']),
//   validationMiddleware(invoiceSchema),
//   invoiceController.updateInvoice.bind(invoiceController)
// );

// router.get(
//   '/',
//   rbacMiddleware(['read:invoices']),
//   invoiceController.getInvoices.bind(invoiceController)
// );

// router.get(
//   '/summary',
//   rbacMiddleware(['read:invoices']),
//   invoiceController.getInvoiceSummary.bind(invoiceController)
// );

// router.get(
//   '/overdue',
//   rbacMiddleware(['read:invoices']),
//   invoiceController.getOverdueInvoices.bind(invoiceController)
// );

// router.get(
//   '/customer/:customerId',
//   rbacMiddleware(['read:invoices']),
//   invoiceController.getCustomerInvoices.bind(invoiceController)
// );

// router.get(
//   '/:id',
//   rbacMiddleware(['read:invoices']),
//   invoiceController.getInvoice.bind(invoiceController)
// );

// router.patch(
//   '/:id/status',
//   rbacMiddleware(['update:invoices']),
//   invoiceController.updateInvoiceStatus.bind(invoiceController)
// );

// router.post(
//   '/:id/send',
//   rbacMiddleware(['update:invoices']),
//   invoiceController.sendInvoice.bind(invoiceController)
// );

// router.post(
//   '/payments',
//   rbacMiddleware(['create:payments']),
//   validationMiddleware(paymentSchema),
//   invoiceController.addPayment.bind(invoiceController)
// );

// router.delete(
//   '/:id',
//   rbacMiddleware(['delete:invoices']),
//   invoiceController.deleteInvoice.bind(invoiceController)
// );

// router.get("/reports/sales", invoiceController.getSalesReport);
// router.get("/reports/gstr1", invoiceController.getGSTR1Report);

// router.get(
//   '/:id/pdf',
//   rbacMiddleware(['read:invoices']),
//   invoiceController.getInvoicePDF.bind(invoiceController)   // ✅ correct method
// );




// export default router;
