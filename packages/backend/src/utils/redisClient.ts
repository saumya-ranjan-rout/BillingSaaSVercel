// src/utils/redisClient.ts
import { createClient } from 'redis';
import logger from './logger'; // if you have a logger utility

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

redisClient.on('error', (err) => {
  logger.error('❌ Redis Client Error: ' + err.message);
});

redisClient.on('connect', () => {
  logger.info('✅ Redis client connected');
});

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

export default redisClient;
