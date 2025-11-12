import Redis from 'ioredis';
import logger  from '../utils/logger';

class RedisClusterManager {
  private static instance: Redis;
  private static isConnected = false;

  static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis({
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        connectTimeout: 10000,
        commandTimeout: 5000,
        lazyConnect: true,
      });

      this.instance.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis connected successfully');
      });

      this.instance.on('error', (error) => {
        logger.error('Redis connection error:', error);
        this.isConnected = false;
      });

      this.instance.on('close', () => {
        this.isConnected = false;
        logger.warn('Redis connection closed');
      });
    }

    return this.instance;
  }

  static async healthCheck(): Promise<boolean> {
    try {
      await this.instance.ping();
      return true;
    } catch {
      return false;
    }
  }

  static getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const redis = RedisClusterManager.getInstance();
export const redisHealthCheck = RedisClusterManager.healthCheck;
