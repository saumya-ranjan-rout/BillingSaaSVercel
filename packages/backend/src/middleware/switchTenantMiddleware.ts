import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/database";
import { Tenant } from "../entities/Tenant";

export const switchTenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newTenantId = req.params.tenantId;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Optional validation: ensure tenant exists
    const tenantRepo = AppDataSource.getRepository(Tenant);
    const exists = await tenantRepo.findOne({ where: { id: newTenantId } });

    if (!exists) {
      return res.status(400).json({ error: "Invalid tenant selected" });
    }

    // 🔥 override tenantId & role dynamically
    req.user.tenantId = newTenantId;
    req.user.role = "admin"; // OR any dynamic role you want

    next();
  } catch (err) {
    res.status(500).json({ error: "Cannot switch tenant" });
  }
};
