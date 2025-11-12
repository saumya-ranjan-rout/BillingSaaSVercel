import { Request, Response } from 'express';
import { ReportService } from '../services/report/ReportService';
import { QueueService } from '../services/queue/QueueService';
import { CacheService } from '../services/cache/CacheService';
import { ReportType,ReportStatus  } from '../entities/Report';
import logger from '../utils/logger';
import { ReadStream } from 'fs';

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export class ReportController {
   constructor(
    private reportService: ReportService,
    private queueService: QueueService,
    private cacheService: CacheService
  ) {}

  async generateReport(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { type, format, filters } = req.body;
      const tenantId = req.user.tenantId;
      
//  const userId = req.user.id;

//       // Validate date range to prevent excessive data processing
//       const fromDate = new Date(filters.fromDate);
//       const toDate = new Date(filters.toDate);
//       const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      
//       if (daysDiff > 365) {
//         return res.status(400).json({ error: 'Date range cannot exceed 1 year' });
//       }

//       // Create initial report record
//       const report = await this.reportService.createReportRecord({
//         name: `Report - ${new Date().toLocaleDateString()}`,
//         type,
//         format,
//         parameters: filters,
//         filters,
//         tenantId,
//         status: ReportStatus.PENDING
//       });

//       // Queue report generation for background processing
//       await this.queueService.queueReportGeneration(tenantId, type, format, filters, report.id);

//       // Invalidate relevant caches
//       await this.cacheService.invalidatePattern(`reports:${tenantId}:*`);

//    res.json({
//         id: report.id,
//         status: 'queued',
//         message: 'Report generation has been queued and will be processed shortly'
//       });


      const report = await this.reportService.generateReport(tenantId, type, format, filters);
      res.json(report);
    } catch (error) {
      logger.error('Error generating report:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

    async getReportStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;

      // Check cache first
      const cacheKey = `report:status:${id}`;
      const cachedStatus = await this.cacheService.get(cacheKey);
      
      if (cachedStatus) {
        return res.json(cachedStatus);
      }

      const report = await this.reportService.getReportById(tenantId, id);
      
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      const status = {
        id: report.id,
        status: report.status,
        progress: report.status === ReportStatus.GENERATING ? '50%' : '100%',
        downloadUrl: report.status === ReportStatus.COMPLETED ? 
          `/api/reports/${id}/download` : null,
        error: report.errorMessage,
        generatedAt: report.generatedAt
      };

      // Cache status for 30 seconds
      await this.cacheService.set(cacheKey, status, 30);

      res.json(status);
    } catch (error) {
      logger.error('Error fetching report status:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }


  async downloadReport(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;

      const report = await this.reportService.getReportById(tenantId, id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      if (!report.filePath) {
        return res.status(400).json({ error: 'Report file not available' });
      }

      // res.download(report.filePath, `${report.name}.${report.format}`, (err) => {
      //   if (err) {
      //     logger.error('Error downloading report file:', err);
      //     res.status(500).json({ error: 'Failed to download report' });
      //   }
      // });
        res.setHeader('Content-Type', this.getContentType(report.format));
      res.setHeader('Content-Disposition', `attachment; filename="${report.name}.${report.format}"`);
      
      // Stream file directly without loading into memory
      const fs = require('fs');
      const fileStream = fs.createReadStream(report.filePath);
      
      fileStream.pipe(res);

      // fileStream.on('error', (error) => {
      fileStream.on('error', (error: NodeJS.ErrnoException) => {
        logger.error('Error streaming report file:', error);
        res.status(500).json({ error: 'Failed to download report' });
      });

    } catch (error) {
      logger.error('Error downloading report:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }


    private getContentType(format: string): string {
      const contentTypes: Record<'pdf' | 'excel' | 'csv' | 'json', string> = {
  pdf: 'application/pdf',
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  json: 'application/json'
};

return contentTypes[format as keyof typeof contentTypes] || 'application/octet-stream';

    // const contentTypes = {
    //   'pdf': 'application/pdf',
    //   'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   'csv': 'text/csv',
    //   'json': 'application/json'
    // };
    
    // return contentTypes[format] || 'application/octet-stream';
  }

  async getReportHistory(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenantId = req.user.tenantId;
      // const { page, limit } = req.query;

      // const history = await this.reportService.getReportHistory(
      //   tenantId,
      //   parseInt(page as string) || 1,
      //   parseInt(limit as string) || 10
      // );

            const { page = 1, limit = 10 } = req.query;

      const cacheKey = `reports:history:${tenantId}:${page}:${limit}`;
            const history = await this.cacheService.getOrSet(cacheKey, async () => {
        return await this.reportService.getReportHistory(
          tenantId, 
          parseInt(page as string), 
          parseInt(limit as string)
        );
      }, 60);


      res.json(history);
    } catch (error) {
      logger.error('Error fetching report history:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getReportById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;

      const report = await this.reportService.getReportById(tenantId, id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json(report);
    } catch (error) {
      logger.error('Error fetching report:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getReportData(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;

      const report = await this.reportService.getReportById(tenantId, id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      if (report.status !== 'completed') {
        return res.status(400).json({ error: 'Report not ready for preview' });
      }

      const reportData = await this.reportService.getReportData(report);
      res.json(reportData);
    } catch (error) {
      logger.error('Error fetching report data:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async deleteReport(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const tenantId = req.user.tenantId;

      await this.reportService.deleteReport(tenantId, id);
      
      res.json({
        message: 'Report deleted successfully',
        reportId: id
      });
    } catch (error) {
      logger.error('Error deleting report:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  // Specific report endpoints
  async generateGSTR1(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.GSTR1_OUTWARD_SUPPLIES);
  }

  async generateGSTR3B(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.GSTR3B_SUMMARY);
  }

  async generateSalesRegister(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.SALES_REGISTER);
  }

  async generatePurchaseRegister(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.PURCHASE_REGISTER);
  }

  async generateHSNSummary(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.HSN_SUMMARY);
  }

  async generateTDSReport(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.TDS_REPORT);
  }

  async generateAuditTrail(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.AUDIT_TRAIL);
  }

  async generateProfitLoss(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.PROFIT_LOSS);
  }

  async generateBalanceSheet(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.BALANCE_SHEET);
  }

  async generateCashBankBook(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.CASH_BANK_BOOK);
  }

  async generateLedgerReport(req: Request, res: Response) {
    await this.generateSpecificReport(req, res, ReportType.LEDGER_REPORT);
  }

  private async generateSpecificReport(req: Request, res: Response, reportType: ReportType) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { format, filters } = req.body;
      const tenantId = req.user.tenantId;

      const report = await this.reportService.generateReport(tenantId, reportType, format, filters);
      res.json(report);

      // const report = await this.reportService.createReportRecord({
      //   name: `${reportType} Report`,
      //   type: reportType,
      //   format,
      //   parameters: filters,
      //   filters,
      //   tenantId,
      //   status: ReportStatus.PENDING
      // });

      // await this.queueService.queueReportGeneration(tenantId, reportType, format, filters, report.id);

      // res.json({
      //   id: report.id,
      //   status: 'queued',
      //   message: `${reportType} report generation has been queued`
      // });

    } catch (error) {
      logger.error(`Error generating ${reportType} report:`, error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
