import { Request, Response, NextFunction } from 'express';
import { ProfessionalUser } from '../entities/ProfessionalUser';
import { AppDataSource } from '../config/database';

export const professionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    
    const professionalRepository = AppDataSource.getRepository(ProfessionalUser);
    const professional = await professionalRepository.findOne({
      where: { userId },
      relations: ['managedTenants']
    });

    if (!professional) {
      return res.status(403).json({ error: 'User is not registered as a professional' });
    }

    if (!professional.isActive) {
      return res.status(403).json({ error: 'Professional account is not active' });
    }

    // Add professional info to request
    req.professional = professional;

    // Check if the professional has access to the requested tenant
    if (req.params.tenantId) {
      const hasAccess = professional.managedTenants.some(
        tenant => tenant.id === req.params.tenantId
      );

      if (!hasAccess) {
        return res.status(403).json({ error: 'Professional does not have access to this tenant' });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Professional authentication failed' });
  }
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      professional?: ProfessionalUser;
    }
  }
}
