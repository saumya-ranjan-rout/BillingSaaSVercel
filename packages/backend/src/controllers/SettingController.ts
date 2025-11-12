import { Request, Response } from "express";
import { SettingService } from "../services/SettingService";

const service = new SettingService();

export class SettingController {
  async get(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const tenantId = req.user.tenantId;
    const settings = await service.getByTenant(tenantId);
    res.json(settings);
  }

  async update(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const tenantId = req.user.tenantId;
    const updated = await service.update(tenantId, req.body);
    res.json(updated);
  }
}

