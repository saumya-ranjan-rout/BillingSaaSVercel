import { Request, Response } from "express";
import { TenantService } from "../services/tenant/TenantService";
import { TenantProvisioningService } from "../services/tenant/TenantProvisioningService";
import { CacheService } from "../services/cache/CacheService";
import logger from "../utils/logger";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly provisioningService: TenantProvisioningService,
    private readonly cacheService: CacheService
  ) {}

  async createTenant(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, businessName } = req.body;

      const { tenant, adminUser } =
        await this.provisioningService.provisionNewTenant(
          { name, businessName },
          { email, password }
        );

      // 🔥 Invalidate cache for this tenant
      await this.cacheService.del(`tenant:${tenant.id}`);

      res.status(201).json({ tenant, adminUser });
    } catch (error) {
      logger.error("Error creating tenant:", { error });
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getTenantDetails(req: Request, res: Response): Promise<void> {
    const tenantId = (req as any).user?.tenantId;
    if (!tenantId) {
      res.status(401).json({ error: "Unauthorized: No tenant found" });
      return;
    }

    try {
      // 🔥 First check cache
      const cacheKey = `tenant:${tenantId}`;
      const cachedTenant = await this.cacheService.get(cacheKey);

      if (cachedTenant) {
        logger.debug("Tenant details served from cache", { tenantId });
        res.json({ ...JSON.parse(cachedTenant as string), cached: true });
        return;
      }

      // If not cached → fetch from DB
      const tenant = await this.tenantService.getTenantById(tenantId);
      if (!tenant) {
        res.status(404).json({ error: "Tenant not found" });
        return;
      }

      // Save to cache for next time
      await this.cacheService.set(
        cacheKey,
        JSON.stringify(tenant),
        60 * 5 // cache 5 min
      );

      res.json({ ...tenant, cached: false });
    } catch (error) {
      logger.error("Error fetching tenant details:", { tenantId, error });
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }

  async updateTenant(req: Request, res: Response): Promise<void> {
    const tenantId = (req as any).user?.tenantId;
    if (!tenantId) {
      res.status(401).json({ error: "Unauthorized: No tenant found" });
      return;
    }

    try {
      const updates = req.body;
      const updatedTenant = await this.tenantService.updateTenant(
        tenantId,
        updates
      );

      // 🔥 Invalidate cache so next fetch is fresh
      await this.cacheService.del(`tenant:${tenantId}`);

      res.json(updatedTenant);
    } catch (error) {
      logger.error("Error updating tenant:", { tenantId, error });
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}





// import { Request, Response } from "express";
// import { TenantService } from "../services/tenant/TenantService";
// import { TenantProvisioningService } from "../services/tenant/TenantProvisioningService";

// export class TenantController {
//   private tenantService: TenantService;
//   private provisioningService: TenantProvisioningService;

//   constructor(tenantService: TenantService, provisioningService: TenantProvisioningService) {
//     this.tenantService = tenantService;
//     this.provisioningService = provisioningService;
//   }

//   async createTenant(req: Request, res: Response): Promise<void> {
//     try {
//       const { name, email, password, businessName } = req.body;

//       const tenant = await this.provisioningService.provisionNewTenant(
//         { name, businessName },
//         { email, password }
//       );

//       res.status(201).json(tenant);
//     } catch (error: any) {
//       res.status(400).json({
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }

//   async getTenantDetails(req: Request, res: Response): Promise<void> {
//     try {
//       const tenantId = (req as any).user?.tenantId;
//       if (!tenantId) {
//         res.status(401).json({ error: "Unauthorized: No tenant found" });
//         return;
//       }

//       const tenant = await this.tenantService.getTenantById(tenantId);
//       if (!tenant) {
//         res.status(404).json({ error: "Tenant not found" });
//         return;
//       }

//       res.json(tenant);
//     } catch (error: any) {
//       res.status(404).json({
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }

//   async updateTenant(req: Request, res: Response): Promise<void> {
//     try {
//       const tenantId = (req as any).user?.tenantId;
//       if (!tenantId) {
//         res.status(401).json({ error: "Unauthorized: No tenant found" });
//         return;
//       }

//       const updates = req.body;
//       const updatedTenant = await this.tenantService.updateTenant(tenantId, updates);

//       res.json(updatedTenant);
//     } catch (error: any) {
//       res.status(400).json({
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }
// }








// import { Request, Response } from 'express';
// import { TenantService } from '../services/tenant/TenantService';
// import { TenantProvisioningService } from '../services/tenant/TenantProvisioningService';

// export class TenantController {
//   constructor(
//     private tenantService: TenantService,
//     private provisioningService: TenantProvisioningService
//   ) {}

//   async createTenant(req: Request, res: Response) {
//     try {
//       const { name, email, plan, gstin, businessName } = req.body;
//       const tenant = await this.provisioningService.provisionNewTenant({
//         name,
//         email,
//         plan,
//         gstin,
//         businessName
//       });
//       res.status(201).json(tenant);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }

//   async getTenantDetails(req: Request, res: Response) {
//     try {
//       const tenantId = req.user.tenantId;
//       const tenant = await this.tenantService.getTenantById(tenantId);
//       res.json(tenant);
//     } catch (error) {
//       res.status(404).json({ error: error.message });
//     }
//   }

//   async updateTenant(req: Request, res: Response) {
//     try {
//       const tenantId = req.user.tenantId;
//       const updates = req.body;
//       const updatedTenant = await this.tenantService.updateTenant(tenantId, updates);
//       res.json(updatedTenant);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }
// }
