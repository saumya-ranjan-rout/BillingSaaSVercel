// src/app.ts
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cluster from 'cluster';
import os from 'os';

import { initializeDatabase } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { extractTenantFromSubdomain } from './middleware/tenant.middleware';
import logger, { stream } from './utils/logger';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

class ApplicationServer {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Trust proxy (for rate limiting, secure headers, etc.)
    this.app.set('trust proxy', true);

    // CORS
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com', 'https://www.yourdomain.com'] 
        : ['http://192.168.29.17:3000', 'http://192.168.29.17:3001'],
      credentials: true
    }));

    // JSON + URL encoded parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // HTTP request logging (Morgan → Winston)
    this.app.use(morgan('combined', { stream }));

    // Tenant middleware
    this.app.use(extractTenantFromSubdomain);
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Billing SaaS API',
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // Metrics endpoint
    this.app.get('/metrics', (req, res) => {
      res.json({
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid,
        version: process.version,
      });
    });

    // Import routes dynamically
    this.app.use('/api/dashboard', require('./routes/dashboardRoutes').default);
    this.app.use('/api/auth', require('./routes/authRoutes').default);
    this.app.use('/api/notifications', require('./routes/notification.routes').default);
    this.app.use('/api/sync', require('./routes/sync.routes').default);
    this.app.use('/api/invoices', require('./routes/invoiceRoutes').default);
    this.app.use('/api/customers', require('./routes/customerRoutes').default);
    this.app.use('/api/products', require('./routes/productRoutes').default);
    this.app.use('/api/vendors', require('./routes/vendorRoutes').default);
    this.app.use('/api/purchases', require('./routes/purchaseRoutes').default);
    this.app.use('/api/settings', require('./routes/settingRoutes').default);
    this.app.use('/api/reports', require('./routes/reportRoutes').default);
    this.app.use('/api/loyalty', require('./routes/loyaltyRoutes').default);
     this.app.use('/api/users', require('./routes/userRoutes').default);
     this.app.use('/api/subscriptions', require('./routes/subscriptionRoutes').default);
     this.app.use('/api/super-admin', require('./routes/super-admin').default);
     this.app.use('/api/professional-requests', require('./routes/professionalRequestRoutes').default);
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use('*', (req, res) => {
      logger.warn('Route not found', {
        path: req.originalUrl,
        method: req.method,
        ip: req.ip
      });

      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      await initializeDatabase();
      logger.info('Database connected successfully');

      this.app.listen(this.port, () => {
        logger.info(`Server running on port ${this.port} in ${process.env.NODE_ENV || 'development'} mode`);
      });
    } catch (error: any) {
      logger.error('Failed to start server', {
        error: error?.message,
        stack: error?.stack
      });
      process.exit(1);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// Cluster mode in production
if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  const numCPUs = os.cpus().length;
  logger.info(`Master ${process.pid} running with ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    logger.warn(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const server = new ApplicationServer();
  server.start().catch((error) => {
    logger.error('Worker failed to start', { error: error.message, stack: error.stack });
    process.exit(1);
  });
}

export default ApplicationServer;



