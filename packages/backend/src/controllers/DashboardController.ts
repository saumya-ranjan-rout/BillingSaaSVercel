



// billingSoftware-SaaS/packages/backend/src/controllers/DashboardController.ts

import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard/DashboardService';
import { CacheService } from '../services/cache/CacheService';
import logger from '../utils/logger';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly cacheService: CacheService
  ) {}

  async getDashboardData(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const tenantId = req.user.tenantId;
    const cacheKey = `dashboard:${tenantId}`;

    try {
      // 🔥 Check cache first
      const cachedData = await this.cacheService.get(cacheKey);
      if (cachedData) {
        const duration = Date.now() - startTime;
        logger.debug(`Dashboard data served from cache in ${duration}ms`, { tenantId, duration });

        res.json({ ...JSON.parse(cachedData), cached: true });
        return;
      }

      // If not cached → fetch from service
      const dashboardData = await this.dashboardService.getDashboardData(tenantId);

      // Store result in cache for faster next call (e.g., 2 min TTL)
      await this.cacheService.set(cacheKey, JSON.stringify(dashboardData), 60 * 2);

      const duration = Date.now() - startTime;
      logger.debug(`Dashboard data fetched in ${duration}ms`, { tenantId, duration });

      res.json({ ...dashboardData, cached: false });
    } catch (error) {
      logger.error('Error fetching dashboard data:', { tenantId, error });
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async refreshDashboard(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const tenantId = req.user.tenantId;
    const cacheKey = `dashboard:${tenantId}`;

    try {
      // 🔥 Invalidate cache before fetching fresh data
      await this.cacheService.del(cacheKey);

      const dashboardData = await this.dashboardService.getDashboardData(tenantId);

      // Store fresh data again
      await this.cacheService.set(cacheKey, JSON.stringify(dashboardData), 60 * 2);

      res.json({
        ...dashboardData,
        cached: false,
        refreshedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error refreshing dashboard:', { tenantId, error });
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}






