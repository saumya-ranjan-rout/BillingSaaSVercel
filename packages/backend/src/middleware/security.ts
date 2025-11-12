import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '../config/redis-optimized';
import { logger } from '../utils/logger-optimized';

// Advanced rate limiting with Redis storage
const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyGenerator: (req) => {
    const tenantId = (req as any).tenantId || 'unknown';
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    return `${tenantId}:${ip}`;
  },
  points: parseInt(process.env.RATE_LIMIT_POINTS || '100'), // Requests
  duration: parseInt(process.env.RATE_LIMIT_DURATION || '1'), // Per second
  blockDuration: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION || '60'), // Seconds
});

export const securityMiddleware = [
  // CORS with caching
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || true,
    credentials: true,
    maxAge: 86400, // 24 hours cache
  }),

  // Helmet with optimized security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),

  // Compression with brotli support
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  }),

  // Rate limiting middleware
  async (req: any, res: any, next: any) => {
    try {
      await rateLimiter.consume(req.rateLimitKey || 'global');
      next();
    } catch (rejRes: any) {
      logger.warn(`Rate limit exceeded for ${req.rateLimitKey}`);
      res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: Math.ceil(rejRes.msBeforeNext / 1000),
      });
    }
  },
];
