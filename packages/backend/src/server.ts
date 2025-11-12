import 'reflect-metadata';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// import { createApp } from './app';
// import logger from './utils/logger';
import {createApp }from './app';
import logger  from './utils/logger';

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async (): Promise<void> => {
  try {
    const app = await createApp();

    const server = app.listen(PORT as number, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

export { startServer };
