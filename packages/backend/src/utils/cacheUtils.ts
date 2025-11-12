import { redisClient } from '../config/database';

export async function clearTenantCache(tenantId: string, routePrefix: string) {
  const pattern = `cache:${tenantId}:${routePrefix}*`;

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🧹 Cleared ${keys.length} cache keys for ${tenantId} - ${routePrefix}`);
    }
  } catch (err) {
    console.error('Error clearing cache:', err);
  }
}
