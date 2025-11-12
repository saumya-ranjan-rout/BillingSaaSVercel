import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/database';
import ms, { StringValue } from 'ms';

/**
 * Cache middleware
 * ✅ Only caches GET JSON responses for safe routes (allowlist)
 * 🚫 Skips HTML pages, auth/session APIs, or dynamic user-specific data
 */


export function cacheMiddleware(duration: StringValue) {
  const ttlMs = ms(duration);
  if (typeof ttlMs !== 'number') {
    throw new Error(`Invalid cache duration: ${duration}`);
  }

  const ttlSeconds = Math.floor(ttlMs / 1000);

  const allowlist = [
    '/api/products',
    '/api/vendors',
    '/api/categories',
    '/api/customers',
    '/api/invoices',
    '/api/taxes',
    '/api/income-heads',
    '/api/settings/public',
  ];

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const acceptHeader = req.headers.accept || '';

      if (
        req.method !== 'GET' ||
        acceptHeader.includes('text/html') ||
        req.originalUrl.startsWith('/auth') ||
        req.originalUrl.startsWith('/app') ||
        req.originalUrl.startsWith('/api/dashboard') ||
        req.originalUrl.startsWith('/api/profile') ||
        req.originalUrl.includes('session') ||
        !allowlist.some(route => req.originalUrl.startsWith(route))
      ) {
        return next();
      }

      // ✅ Include tenantId in cache key if available
      const tenantId = (req as any).user?.tenantId || 'public';
      // const key = `cache:${tenantId}:${req.originalUrl}`;
const key = `cache:${tenantId}:${req.originalUrl}`;

//console.log("key",key);
      const cached = await redisClient.get(key);
      //console.log("cachedkey",cached);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        if (res.statusCode === 200) {
          redisClient.setex(key, ttlSeconds, JSON.stringify(body));
        }
        res.setHeader('X-Cache', 'MISS');
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Cache middleware error:', err);
      next();
    }
  };
}

// export function cacheMiddleware(duration: StringValue) {
//   const ttlMs = ms(duration);
//   if (typeof ttlMs !== 'number') {
//     throw new Error(`Invalid cache duration: ${duration}`);
//   }

//   const ttlSeconds = Math.floor(ttlMs / 1000);

//   // ✅ Allowlist of routes that can safely be cached
//   const allowlist = [
//     '/api/products',
//     '/api/vendors',
//     '/api/categories',
//     '/api/customers',
//     '/api/taxes',
//     '/api/income-heads',
//     '/api/settings/public', // if you have public settings
//   ];

//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const acceptHeader = req.headers.accept || '';

//       // 🚫 Skip caching if:
//       // - Not a GET request
//       // - Requesting HTML
//       // - Not in allowlist
//       // - Any auth/session related URL
//       if (
//         req.method !== 'GET' ||
//         acceptHeader.includes('text/html') ||
//         req.originalUrl.startsWith('/auth') ||
//         req.originalUrl.startsWith('/app') ||
//         req.originalUrl.startsWith('/api/dashboard') ||
//         req.originalUrl.startsWith('/api/profile') ||
//         req.originalUrl.includes('session') ||
//         !allowlist.some(route => req.originalUrl.startsWith(route))
//       ) {
//         return next();
//       }

//       const key = `cache:${req.originalUrl}`;

//       // ✅ Try fetching from Redis
//       const cached = await redisClient.get(key);
//       if (cached) {
//         res.setHeader('X-Cache', 'HIT');
//         return res.json(JSON.parse(cached));
//       }

//       // ✅ Patch res.json to store cache
//       const originalJson = res.json.bind(res);
//       res.json = (body: any) => {
//         if (res.statusCode === 200) {
//           redisClient.setex(key, ttlSeconds, JSON.stringify(body));
//         }
//         res.setHeader('X-Cache', 'MISS');
//         return originalJson(body);
//       };

//       next();
//     } catch (err) {
//       console.error('Cache middleware error:', err);
//       next(); // Don’t block request on Redis failure
//     }
//   };
// }




// // packages/backend/src/middleware/cache.ts
// import { Request, Response, NextFunction } from 'express';
// import { redisClient } from '../config/database';
// import ms, { StringValue } from 'ms';

// /**
//  * Cache middleware
//  * @param duration - e.g. "5 minutes", "10s", "1h"
//  */
// export function cacheMiddleware(duration: StringValue) {
//   const ttlMs = ms(duration); // returns number (ms)

//   if (typeof ttlMs !== 'number') {
//     throw new Error(`Invalid cache duration: ${duration}`);
//   }

//   const ttlSeconds = Math.floor(ttlMs / 1000);

//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const key = `cache:${req.originalUrl}`;

//       // 1️⃣ Try to fetch from Redis
//       const cached = await redisClient.get(key);
//       if (cached) {
//         res.setHeader('X-Cache', 'HIT');
//         return res.json(JSON.parse(cached));
//       }

//       // 2️⃣ Monkey patch res.json to store in Redis
//       const originalJson = res.json.bind(res);
//       res.json = (body: any) => {
//         redisClient.setex(key, ttlSeconds, JSON.stringify(body)); // TTL in seconds
//         res.setHeader('X-Cache', 'MISS');
//         return originalJson(body);
//       };

//       next();
//     } catch (err) {
//       console.error('Cache middleware error:', err);
//       next(); // don’t block request on Redis failure
//     }
//   };
// }
