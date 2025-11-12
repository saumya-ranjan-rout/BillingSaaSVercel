import Redis from 'ioredis';
import logger from '../../utils/logger';

export class CacheService {
  private redis: Redis;
  private readonly DEFAULT_TTL = 300; // 5 minutes

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        return Math.min(times * 50, 2000); // waits 50ms, 100ms, ..., up to 2s
      },
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });
  }

  
  /**
   * Store value in cache with TTL
   */
  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl > 0) {
        await this.redis.set(key, serializedValue, 'EX', ttl);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      logger.error(`Cache set error [${key}]:`, error);
    }
  }

  /**
   * Get cached value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Cache get error [${key}]:`, error);
      return null;
    }
  }

get rediss() {
  return this.redis;
}
  /**
   * Delete cached value
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error(`Cache delete error [${key}]:`, error);
    }
  }

  /**
   * Get value from cache or set it if not found
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Invalidate keys matching a pattern (safe SCAN instead of KEYS for production)
   */

  async invalidatePattern(pattern: string): Promise<void> {
  try {
    const keys: string[] = [];
    const stream = this.redis.scanStream({ match: pattern, count: 100 });

    for await (const chunk of stream) {
      keys.push(...chunk);
    }

    if (keys.length > 0) {
      await this.redis.del(...keys);
      logger.info(`🧹 Cleared ${keys.length} cache keys matching ${pattern}`);
    }
  } catch (error) {
    logger.error(`Cache invalidate pattern error [${pattern}]:`, error);
  }
}

  // async invalidatePattern(pattern: string): Promise<void> {
  //   try {
  //     const stream = this.redis.scanStream({ match: pattern, count: 100 });
  //     const pipeline = this.redis.pipeline();

  //     stream.on('data', (keys: string[]) => {
  //       if (keys.length) {
  //         keys.forEach((key) => pipeline.del(key));
  //       }
  //     });

  //     await new Promise((resolve, reject) => {
  //       stream.on('end', async () => {
  //         if (pipeline.length > 0) {
  //           await pipeline.exec();
  //         }
  //         resolve(null);
  //       });
  //       stream.on('error', reject);
  //     });
  //   } catch (error) {
  //     logger.error(`Cache invalidate pattern error [${pattern}]:`, error);
  //   }
  // }

  /**
   * Store multiple values at once
   */
  async mset(values: Map<string, any>, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();

      values.forEach((value, key) => {
        const serialized = JSON.stringify(value);
        if (ttl > 0) {
          pipeline.set(key, serialized, 'EX', ttl);
        } else {
          pipeline.set(key, serialized);
        }
      });

      await pipeline.exec();
    } catch (error) {
      logger.error('Cache mset error:', error);
    }
  }

  /**
   * Check Redis connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }

  /**
   * Centralized cache keys
   */
  static Keys = {
    tenantDashboard: (tenantId: string) => `dashboard:${tenantId}`,
    invoiceList: (tenantId: string, page: number, limit?: number, search?: string, status?: string) =>
      `invoices:${tenantId}:${page}:${limit || ''}:${search || ''}:${status || ''}`,
    customerList: (tenantId: string) => `customers:${tenantId}`,
    reportData: (reportId: string) => `report:${reportId}`,
  };
}



// import Redis from 'ioredis';
// import logger from '../../utils/logger';

// export class CacheService {
//   private redis: Redis;
//   private readonly DEFAULT_TTL = 300; // 5 minutes

//   constructor() {
//    this.redis = new Redis({
//   host: process.env.REDIS_HOST || 'localhost',
//   port: Number(process.env.REDIS_PORT) || 6379,
//   password: process.env.REDIS_PASSWORD,
//   maxRetriesPerRequest: 3,
//   retryStrategy(times) {
//     return Math.min(times * 50, 2000); // waits 50ms, 100ms, ..., up to 2s
//   },
// });


//     this.redis.on('error', (error) => {
//       logger.error('Redis connection error:', error);
//     });
//   }

//   async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
//     try {
//       const serializedValue = JSON.stringify(value);
//       if (ttl > 0) {
//         await this.redis.setex(key, ttl, serializedValue);
//       } else {
//         await this.redis.set(key, serializedValue);
//       }
//     } catch (error) {
//       logger.error('Cache set error:', error);
//     }
//   }

//   async get<T>(key: string): Promise<T | null> {
//     try {
//       const value = await this.redis.get(key);
//       return value ? JSON.parse(value) : null;
//     } catch (error) {
//       logger.error('Cache get error:', error);
//       return null;
//     }
//   }

//   async del(key: string): Promise<void> {
//     try {
//       await this.redis.del(key);
//     } catch (error) {
//       logger.error('Cache delete error:', error);
//     }
//   }

//   async getOrSet<T>(
//     key: string, 
//     factory: () => Promise<T>, 
//     ttl: number = this.DEFAULT_TTL
//   ): Promise<T> {
//     const cached = await this.get<T>(key);
//     if (cached !== null) {
//       return cached;
//     }

//     const value = await factory();
//     await this.set(key, value, ttl);
//     return value;
//   }

//   async invalidatePattern(pattern: string): Promise<void> {
//     try {
//       const keys = await this.redis.keys(pattern);
//       if (keys.length > 0) {
//         await this.redis.del(...keys);
//       }
//     } catch (error) {
//       logger.error('Cache invalidate pattern error:', error);
//     }
//   }

//   // Cache keys pattern
//   static Keys = {
//     tenantDashboard: (tenantId: string) => `dashboard:${tenantId}`,
//     invoiceList: (tenantId: string, page: number) => `invoices:${tenantId}:${page}`,
//     customerList: (tenantId: string) => `customers:${tenantId}`,
//     reportData: (reportId: string) => `report:${reportId}`,
//   };
// }
