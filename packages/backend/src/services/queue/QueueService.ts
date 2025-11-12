import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { ReportService } from '../report/ReportService';
import { InvoiceService } from '../invoice/InvoiceService';
import logger from '../../utils/logger';

export enum JobType {
  GENERATE_REPORT = 'generate_report',
  SEND_BULK_INVOICES = 'send_bulk_invoices',
  SYNC_GST_DATA = 'sync_gst_data',
  SEND_NOTIFICATION = 'send_notification'
}

export class QueueService {
  private redis: Redis;
  private reportQueue: Queue;
  private notificationQueue: Queue;
  private reportService: ReportService;
  private invoiceService: InvoiceService;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null
    });

    this.reportQueue = new Queue(JobType.GENERATE_REPORT, { connection: this.redis });
    this.notificationQueue = new Queue(JobType.SEND_NOTIFICATION, { connection: this.redis });
    
    this.reportService = new ReportService();
    this.invoiceService = new InvoiceService();

    this.setupWorkers();
  }

  private setupWorkers() {
    // Report generation worker
    new Worker(JobType.GENERATE_REPORT, async (job: Job) => {
      const { tenantId, reportType, format, filters, reportId } = job.data;
      
      try {
        const report = await this.reportService.generateReport(tenantId, reportType, format, filters);
        logger.info(`Report ${reportId} generated successfully`);
        return report;
      } catch (error) {
        logger.error(`Report generation failed for job ${job.id}:`, error);
        throw error;
      }
    }, { connection: this.redis });

    // Notification worker
    new Worker(JobType.SEND_NOTIFICATION, async (job: Job) => {
      const { type, userId, data } = job.data;
      
      try {
        await this.sendNotification(type, userId, data);
        logger.info(`Notification sent successfully for user ${userId}`);
      } catch (error) {
        logger.error(`Notification failed for job ${job.id}:`, error);
        throw error;
      }
    }, { connection: this.redis });
  }

  async queueReportGeneration(tenantId: string, reportType: string, format: string, filters: any, reportId: string) {
    return await this.reportQueue.add('generate', {
      tenantId,
      reportType,
      format,
      filters,
      reportId
    }, {
      removeOnComplete: 50, // Keep last 50 successful jobs
      removeOnFail: 10,     // Keep last 10 failed jobs
      attempts: 3,          // Retry 3 times
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });
  }

  async queueNotification(type: string, userId: string, data: any) {
    return await this.notificationQueue.add('send', {
      type,
      userId,
      data
    }, {
      delay: 1000, // 1 second delay
      attempts: 3
    });
  }

  private async sendNotification(type: string, userId: string, data: any) {
    // Implementation for sending email/SMS/WhatsApp notifications
    // Integrate with your notification service
    console.log(`Sending ${type} notification to user ${userId}`, data);
  }
}
