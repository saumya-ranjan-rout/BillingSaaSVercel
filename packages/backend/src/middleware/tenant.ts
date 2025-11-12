import { Request, Response, NextFunction } from 'express';

export function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  //console.log("Tenant check:", req.user?.tenantId);
  try {
    const user = (req as any).user;
    if (!user || !user.tenantId) {
      return res.status(400).json({ error: 'Tenant context missing' });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: 'Tenant validation failed' });
  }
}
