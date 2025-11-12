import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { InvoiceService } from '../services/invoice/InvoiceService';
import { SettingService } from '../services/SettingService';
import { CacheService } from '../services/cache/CacheService';
import { QueueService } from '../services/queue/QueueService';
import { InvoiceStatus, InvoiceType } from '../entities/Invoice';
import logger from '../utils/logger';
import { ok, errorResponse } from '../utils/response';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class InvoiceController {
  constructor(
    private invoiceService: InvoiceService,
    private settingService: SettingService,
    private cacheService: CacheService,
    private queueService: QueueService
  ) {}


    async list(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { 
        cursor, 
        limit = 20, 
        search, 
        status, 
        customerId,
        startDate,
        endDate,
        pagination = 'keyset' // 'keyset' or 'offset'
      } = req.query;

      let result;
      
      if (pagination === 'keyset') {
        // Use keyset pagination for better performance
        result = await this.invoiceService.getInvoicesWithKeysetPagination(tenantId, {
          cursor: cursor as string,
          limit: Number(limit),
          search: search as string,
          status: status as any,
          customerId: customerId as string,
          startDate: startDate ? new Date(startDate as string) : undefined,
          endDate: endDate ? new Date(endDate as string) : undefined,
        });
      } else {
        // Use offset pagination for smaller datasets
        const { page = 1 } = req.query;
        result = await this.invoiceService.getInvoicesForListView(tenantId, {
          page: Number(page),
          limit: Number(limit),
          search: search as string,
          status: status as any,
          customerId: customerId as string,
        });
      }

      return ok(res, result);
    } catch (error) {
      logger.error('Error fetching invoices:', error);
      return errorResponse(res, 'Failed to fetch invoices');
    }
  }

  async get(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      // Use detail method that loads relations
      const invoice = await this.invoiceService.getInvoiceWithDetails(tenantId, id);

      return ok(res, invoice);
    } catch (error) {
      logger.error('Error fetching invoice:', error);
      return errorResponse(res, 'Failed to fetch invoice');
    }
  }

  
  async createInvoice(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const tenantId = req.user.tenantId;
      const invoiceData = req.body;
const customerName = invoiceData.customerName;
const customerEmail = invoiceData.customerEmail;

let customerIdToUse = invoiceData.customerId; // fallback if present
if (customerEmail) {
  const customer = await this.invoiceService.getOrCreateCustomerByEmail(tenantId,customerName, customerEmail);
  customerIdToUse = customer.id;
}
//console.log("updateInvoice_customerIdToUse",customerIdToUse,"invoiceData",invoiceData);
const payloadForService = { ...invoiceData, customerId: customerIdToUse };

// remove the customerName/email fields so createInvoice signature remains same (optional)
delete payloadForService.customerName;
delete payloadForService.customerEmail;

      if (payloadForService.items?.length > 100) {
        return res.status(400).json({ error: 'Cannot create invoice with more than 100 items' });
      }

     // console.log("createInvoice_payloadForService",payloadForService);

      const invoice = await this.invoiceService.createInvoice(tenantId, payloadForService);

      //console.log(await this.cacheService.rediss.keys('*'));
      // Invalidate cache in parallel
     await Promise.all([
      //  this.cacheService.del(`invoice:${id}:${tenantId}`),
      this.cacheService.del(`invoices:${tenantId}:*`),
         this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
        this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
          this.cacheService.invalidatePattern(`*Invoice*${tenantId}*`)
      ]);


      // Queue notification (non-blocking)
      this.queueService
        .queueNotification('invoice_created', req.user.id, {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.totalAmount
        })
        .catch(err => logger.error('Failed to queue invoice_created notification', err));

      logger.info(`Invoice created in ${Date.now() - startTime}ms`, { invoiceId: invoice.id, tenantId });
      res.status(201).json(invoice);
    } catch (error) {
      logger.error('Error creating invoice:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async updateInvoice(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const { id } = req.params;
      const tenantId = req.user.tenantId;
      const updates = req.body;

      let customerIdToUse = updates.customerId;

if (updates.customerEmail || updates.customerName) {
  const customer = await this.invoiceService.getOrCreateCustomerByEmail(tenantId, updates.customerName, updates.customerEmail);
  customerIdToUse = customer.id;
}

//console.log("updateInvoice_customerIdToUse",customerIdToUse,"updates",updates);
const payloadForUpdate = { ...updates, customerId: customerIdToUse };
delete payloadForUpdate.customerName;
delete payloadForUpdate.customerEmail;

const invoice = await this.invoiceService.updateInvoice(tenantId, id, payloadForUpdate);
     // const invoice = await this.invoiceService.updateInvoice(tenantId, id, updates);

//console.log(await this.cacheService.rediss.keys('*'));

     await Promise.all([
        this.cacheService.del(`invoices:${tenantId}:${id}`),
         this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
        this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
          this.cacheService.invalidatePattern(`*Invoice*${tenantId}*`)
      ]);

      logger.info(`Invoice updated in ${Date.now() - startTime}ms`, { id, tenantId });
      res.json(invoice);
    } catch (error) {
      logger.error('Error updating invoice:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getInvoice(req: Request, res: Response) {
    //console.log("getInvoice_params",req.params);
    const startTime = Date.now();
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const tenantId = req.user.tenantId;

      const cacheKey = `invoice:${id}:${tenantId}`;
      const invoice = await this.cacheService.getOrSet(cacheKey, () => this.invoiceService.getInvoice(tenantId, id), 300);


      //console.log("getInvoice_invoice",invoice);

      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

      logger.debug(`Invoice fetched in ${Date.now() - startTime}ms`, { id, tenantId });
      res.json(invoice);
    } catch (error) {
      logger.error('Error fetching invoice:', error);
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }

  async getInvoices(req: Request, res: Response) {
   // console.log("getInvoices_query",req.query);
    const startTime = Date.now();
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tenantId = req.user.tenantId;

      const { page = 1, limit = 10, search, status, type, customerId, startDate, endDate } = req.query;
      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));

      const options = {
        page: pageNum,
        limit: limitNum,
        search: search as string,
        status: status as InvoiceStatus,
        type: type ? (type as InvoiceType) : undefined,
        customerId: customerId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      };

      const cacheKey = `invoices:${tenantId}:${JSON.stringify(options)}`;
      const invoices = await this.cacheService.getOrSet(cacheKey, () => this.invoiceService.getInvoices(tenantId, options), 60);

      //console.log("getInvoices_invoices",invoices);

      logger.debug(`Invoices fetched in ${Date.now() - startTime}ms`, { tenantId, page: pageNum, limit: limitNum });
      res.json(invoices);
    } catch (error) {
      logger.error('Error fetching invoices:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async updateInvoiceStatus(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const { status } = req.body;
      const tenantId = req.user.tenantId;

      const invoice = await this.invoiceService.updateInvoiceStatus(tenantId, id, status);
      res.json(invoice);
    } catch (error) {
      logger.error('Error updating invoice status:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async addPayment(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const tenantId = req.user.tenantId;
      const payment = await this.invoiceService.addPayment(tenantId, req.body);
      res.status(201).json(payment);
    } catch (error) {
      logger.error('Error adding payment:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async deleteInvoice(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const tenantId = req.user.tenantId;

      await this.invoiceService.deleteInvoice(tenantId, id);

//console.log(await this.cacheService.rediss.keys('*'));
      await Promise.all([
        this.cacheService.del(`invoices:${tenantId}:${id}`),
         this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
        this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
          this.cacheService.invalidatePattern(`*Invoice*${tenantId}*`)
      ]);

      logger.info(`Invoice deleted in ${Date.now() - startTime}ms`, { id, tenantId });
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting invoice:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async bulkCreateInvoices(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tenantId = req.user.tenantId;
      const { invoices } = req.body;

      if (!invoices || invoices.length > 50) {
        return res.status(400).json({ error: 'Cannot process more than 50 invoices in bulk' });
      }

      const createdInvoices = await this.invoiceService.bulkCreateInvoices(tenantId, invoices);

      await Promise.all([
         this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
       // this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
        this.cacheService.invalidatePattern(`dashboard:${tenantId}`)
      ]);

      res.status(201).json(createdInvoices);
    } catch (error) {
      logger.error('Error bulk creating invoices:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getCustomerInvoices(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { customerId } = req.params;
      const tenantId = req.user.tenantId;

      const invoices = await this.invoiceService.getCustomerInvoices(tenantId, customerId);
      res.json(invoices);
    } catch (error) {
      logger.error('Error fetching customer invoices:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getOverdueInvoices(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tenantId = req.user.tenantId;

      const cacheKey = `invoices:overdue:${tenantId}`;
      const invoices = await this.cacheService.getOrSet(cacheKey, () => this.invoiceService.getOverdueInvoices(tenantId), 300);

      res.json(invoices);
    } catch (error) {
      logger.error('Error fetching overdue invoices:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getInvoiceSummary(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tenantId = req.user.tenantId;

      const summary = await this.invoiceService.getInvoiceSummary(tenantId);
      res.json(summary);
    } catch (error) {
      logger.error('Error fetching invoice summary:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async sendInvoice(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const tenantId = req.user.tenantId;

      const invoice = await this.invoiceService.sendInvoice(tenantId, id);

      this.queueService
        .queueNotification('invoice_sent', req.user.id, {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          customer: invoice.customer?.name
        })
        .catch(err => logger.error('Failed to queue invoice_sent notification', err));

      res.json(invoice);
    } catch (error) {
      logger.error('Error sending invoice:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  getSalesReport = async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const tenantId = req.user.tenantId;
      const { startDate, endDate } = req.query;

      const report = await this.invoiceService.getSalesReport(tenantId, {
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.json(report);
    } catch (err) {
      res.status(500).json({ message: "Error fetching Sales Report", error: err });
    }
  };

  getGSTR1Report = async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const tenantId = req.user.tenantId;
      const { startDate, endDate } = req.query;

      const report = await this.invoiceService.getGSTR1Report(tenantId, {
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.json(report);
    } catch (err) {
      res.status(500).json({ message: "Error fetching GSTR-1 Report", error: err });
    }
  };

  getInvoicePDF = async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const tenantId = req.user.tenantId;

      const [invoice, setting] = await Promise.all([
        this.invoiceService.getInvoice(tenantId, req.params.id),
        this.settingService.getByTenant(tenantId)
      ]);

      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
      if (!setting) return res.status(404).json({ error: "Tenant settings not found" });

      const pdfBuffer = await this.invoiceService.generateInvoicePDF(invoice, setting);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=invoice-${invoice.invoiceNumber}.pdf`);
      return res.send(pdfBuffer);
    } catch (error) {
      logger.error("Error generating invoice PDF", error);
      return res.status(500).json({ error: "Failed to generate invoice PDF ❌" });
    }
  };
}








// import { Request, Response } from 'express';
// import { validationResult } from 'express-validator';
// import { InvoiceService } from '../services/invoice/InvoiceService';
// import { SettingService } from '../services/SettingService';
// import { CacheService } from '../services/cache/CacheService';
// import { QueueService } from '../services/queue/QueueService';
// import { InvoiceStatus, InvoiceType } from '../entities/Invoice';
// import { PaymentStatus } from '../entities/PaymentInvoice';
// import logger from '../utils/logger';

// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) {
//     return error.message;
//   }
//   return String(error);
// }

// export class InvoiceController {
//   constructor(private invoiceService: InvoiceService,private settingService: SettingService,
//     private cacheService: CacheService,
//     private queueService: QueueService) {}

//   async createInvoice(req: Request, res: Response) {
//      const startTime = Date.now();
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const invoiceData = req.body;

//        if (invoiceData.items && invoiceData.items.length > 100) {
//         return res.status(400).json({ error: 'Cannot create invoice with more than 100 items' });
//       }


//       const invoice = await this.invoiceService.createInvoice(tenantId, invoiceData);

//             await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);
//       await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);

//       // Queue notification for new invoice
//       await this.queueService.queueNotification('invoice_created', req.user.id, {
//         invoiceId: invoice.id,
//         invoiceNumber: invoice.invoiceNumber,
//         amount: invoice.totalAmount
//       });

//       const duration = Date.now() - startTime;
//       logger.info(`Invoice created in ${duration}ms`, { 
//         invoiceId: invoice.id, 
//         tenantId,
//         duration 
//       });


//       res.status(201).json(invoice);
//     } catch (error) {
//       logger.error('Error creating invoice:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }




//   async updateInvoice(req: Request, res: Response) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const tenantId = req.user.tenantId;
//       const updates = req.body;

//       const invoice = await this.invoiceService.updateInvoice(tenantId, id, updates);
      
//       // Invalidate caches
//       await this.cacheService.del(`invoice:${id}:${tenantId}`);
//       await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);
//       await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);

//       res.json(invoice);
//     } catch (error) {
//       logger.error('Error updating invoice:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }
//   async getInvoice(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const tenantId = req.user.tenantId;

//      // const invoice = await this.invoiceService.getInvoice(tenantId, id);

//          const cacheKey = `invoice:${id}:${tenantId}`;
      
//       const invoice = await this.cacheService.getOrSet(cacheKey, async () => {
//         return await this.invoiceService.getInvoice(tenantId, id);
//       }, 300); // Cache for 5 minutes

//       if (!invoice) {
//         return res.status(404).json({ error: 'Invoice not found' });
//       }

//       res.json(invoice);
//     } catch (error) {
//       logger.error('Error fetching invoice:', error);
//       res.status(404).json({ error: getErrorMessage(error) });
//     }
//   }

//   async getInvoices(req: Request, res: Response) {
//         const startTime = Date.now();
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       // const { page, limit, search, status, type, customerId, startDate, endDate } = req.query;
//         const { 
//         page = 1, 
//         limit = 10, 
//         search, 
//         status, 
//         type, 
//         customerId, 
//         startDate, 
//         endDate 
//       } = req.query;


//        const pageNum = Math.max(1, parseInt(page as string));
//       const limitNum = Math.min(100, Math.max(1, parseInt(limit as string))); // Max 100 per page

//       const options = {
//         page: pageNum,
//         limit: limitNum,
//         search: search as string,
//         status: status as InvoiceStatus,
//         type: type ? (type as InvoiceType) : undefined,
//         customerId: customerId as string,
//         startDate: startDate ? new Date(startDate as string) : undefined,
//         endDate: endDate ? new Date(endDate as string) : undefined
//       };

  
//          const cacheKey = `invoices:${tenantId}:${JSON.stringify(options)}`;

//      // const invoices = await this.invoiceService.getInvoices(tenantId, options);

//            const invoices = await this.cacheService.getOrSet(cacheKey, async () => {
//         return await this.invoiceService.getInvoices(tenantId, options);
//       }, 60); // Cache for 1 minute

//       const duration = Date.now() - startTime;
//       logger.debug(`Invoices fetched in ${duration}ms`, { 
//         tenantId, 
//         page: pageNum, 
//         limit: limitNum,
//         duration 
//       });

//       res.json(invoices);
//     } catch (error) {
//       logger.error('Error fetching invoices:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async updateInvoiceStatus(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const { status } = req.body;
//       const tenantId = req.user.tenantId;
      
//       const invoice = await this.invoiceService.updateInvoiceStatus(tenantId, id, status);
//       res.json(invoice);
//     } catch (error) {
//       logger.error('Error updating invoice status:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async addPayment(req: Request, res: Response) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const paymentData = req.body;
//       const payment = await this.invoiceService.addPayment(tenantId, paymentData);
//       res.status(201).json(payment);
//     } catch (error) {
//       logger.error('Error adding payment:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

 

//     async deleteInvoice(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const tenantId = req.user.tenantId;

//       await this.invoiceService.deleteInvoice(tenantId, id);
      
//       // Invalidate caches
//       await this.cacheService.del(`invoice:${id}:${tenantId}`);
//       await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);
//       await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);

//       res.status(204).send();
//     } catch (error) {
//       logger.error('Error deleting invoice:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }
//    async bulkCreateInvoices(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const { invoices } = req.body;

//       // Limit bulk operations to prevent abuse
//       if (!invoices || invoices.length > 50) {
//         return res.status(400).json({ error: 'Cannot process more than 50 invoices in bulk' });
//       }

//       const createdInvoices = await this.invoiceService.bulkCreateInvoices(tenantId, invoices);
      
//       // Invalidate caches
//       await this.cacheService.invalidatePattern(`invoices:${tenantId}:*`);
//       await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);

//       res.status(201).json(createdInvoices);
//     } catch (error) {
//       logger.error('Error bulk creating invoices:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }


//   async getCustomerInvoices(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { customerId } = req.params;
//       const tenantId = req.user.tenantId;
//       const invoices = await this.invoiceService.getCustomerInvoices(tenantId, customerId);
//       res.json(invoices);
//     } catch (error) {
//       logger.error('Error fetching customer invoices:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }



//     async getOverdueInvoices(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;

//       const cacheKey = `invoices:overdue:${tenantId}`;
      
//       const invoices = await this.cacheService.getOrSet(cacheKey, async () => {
//         return await this.invoiceService.getOverdueInvoices(tenantId);
//       }, 300); // Cache for 5 minutes

//       res.json(invoices);
//     } catch (error) {
//       logger.error('Error fetching overdue invoices:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async getInvoiceSummary(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const summary = await this.invoiceService.getInvoiceSummary(tenantId);
//       res.json(summary);
//     } catch (error) {
//       logger.error('Error fetching invoice summary:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }



//     async sendInvoice(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const tenantId = req.user.tenantId;

//       const invoice = await this.invoiceService.sendInvoice(tenantId, id);
      
//       // Queue email notification
//       await this.queueService.queueNotification('invoice_sent', req.user.id, {
//         invoiceId: invoice.id,
//         invoiceNumber: invoice.invoiceNumber,
//         customer: invoice.customer?.name
//       });

//       res.json(invoice);
//     } catch (error) {
//       logger.error('Error sending invoice:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }


//   // Sales Report
// // Sales Report
// getSalesReport = async (req: Request, res: Response) => {
//   //console.log("hi sales report controller");
//   try {
//     if (!req.user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const tenantId = req.user.tenantId;
//     const { startDate, endDate } = req.query;

//     const report = await this.invoiceService.getSalesReport(tenantId, {
//       startDate: startDate as string,
//       endDate: endDate as string,
//     });

//     res.json(report);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching Sales Report", error: err });
//   }
// };

// // GSTR-1 Report
// getGSTR1Report = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const tenantId = req.user.tenantId;
//     const { startDate, endDate } = req.query;

//     const report = await this.invoiceService.getGSTR1Report(tenantId, {
//       startDate: startDate as string,
//       endDate: endDate as string,
//     });

//     res.json(report);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching GSTR-1 Report", error: err });
//   }
// };

// getInvoicePDF = async (req: Request, res: Response) => {
//   //console.log("Received request for PDF of invoice ID:", req.params.id);
//   try {
//     if (!req.user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const tenantId = req.user.tenantId;

//      const invoice = await this.invoiceService.getInvoice(tenantId, req.params.id);
//     const setting = await this.settingService.getByTenant(tenantId);
// // console.log("Fetched invoice:", invoice);
// // console.log("Fetched settings:", setting);
//     if (!invoice) {
//       return res.status(404).json({ error: "Invoice not found" });
//     }
// if (!setting) {
//   return res.status(404).json({ error: "Tenant settings not found" });
// }

//    // console.log("✅ Sending PDF for invoice", invoice.invoiceNumber);

//     const pdfBuffer = await this.invoiceService.generateInvoicePDF(invoice,setting);

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `inline; filename=invoice-${invoice.invoiceNumber}.pdf`
//     );

//     return res.send(pdfBuffer);
//   } catch (error) {
//     console.error("Error generating invoice PDF", error);
//     return res.status(500).json({ error: "Failed to generate invoice PDF ❌" });
//   }
// };

// }





























//   async updateInvoice(req: Request, res: Response) {
//   try {
//     if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

//     const { id } = req.params;
//     const tenantId = req.user.tenantId;
//     const invoiceData = req.body;

//     const updatedInvoice = await this.invoiceService.updateInvoice(tenantId, id, invoiceData);
//     res.json(updatedInvoice);
//   } catch (error) {
//     logger.error('Error updating invoice:', error);
//     res.status(400).json({ error: getErrorMessage(error) });
//   }
// }


    // const options = {
      //   page: parseInt(page as string) || 1,
      //   limit: parseInt(limit as string) || 10,
      //   search: search as string,
      //   status: status as InvoiceStatus,
      //   type: type as InvoiceType,
      //   customerId: customerId as string,
      //   startDate: startDate ? new Date(startDate as string) : undefined,
      //   endDate: endDate ? new Date(endDate as string) : undefined
      // };

 // async deleteInvoice(req: Request, res: Response) {
  //   try {
  //     if (!req.user) {
  //       return res.status(401).json({ error: 'Unauthorized' });
  //     }

  //     const { id } = req.params;
  //     const tenantId = req.user.tenantId;
  //     await this.invoiceService.deleteInvoice(tenantId, id);
  //     res.status(204).send();
  //   } catch (error) {
  //     logger.error('Error deleting invoice:', error);
  //     res.status(400).json({ error: getErrorMessage(error) });
  //   }
  // }

  // async getOverdueInvoices(req: Request, res: Response) {
  //   try {
  //     if (!req.user) {
  //       return res.status(401).json({ error: 'Unauthorized' });
  //     }

  //     const tenantId = req.user.tenantId;
  //     const invoices = await this.invoiceService.getOverdueInvoices(tenantId);
  //     res.json(invoices);
  //   } catch (error) {
  //     logger.error('Error fetching overdue invoices:', error);
  //     res.status(400).json({ error: getErrorMessage(error) });
  //   }
  // }

  // async sendInvoice(req: Request, res: Response) {
  //   try {
  //     if (!req.user) {
  //       return res.status(401).json({ error: 'Unauthorized' });
  //     }

  //     const { id } = req.params;
  //     const tenantId = req.user.tenantId;
  //     const invoice = await this.invoiceService.sendInvoice(tenantId, id);
  //     res.json(invoice);
  //   } catch (error) {
  //     logger.error('Error sending invoice:', error);
  //     res.status(400).json({ error: getErrorMessage(error) });
  //   }
  // }