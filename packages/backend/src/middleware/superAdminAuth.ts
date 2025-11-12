import { Request, Response, NextFunction } from 'express';
import { SuperAdmin } from '../entities/SuperAdmin';
import { AppDataSource } from '../config/database';

export const superAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user || typeof user !== 'object') {
      return res.status(401).json({ error: 'Unauthorized: user not found' });
    }

    const userId =
      'id' in user && (typeof user.id === 'string' || typeof user.id === 'number')
        ? user.id
        : null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: user ID missing' });
    }

    const superAdminRepository = AppDataSource.getRepository(SuperAdmin);
    const superAdmin = await superAdminRepository.findOne({
      where: { userId }, // ✅ fixed: match on userId, not id
      relations: ['user'],
    });

    if (!superAdmin) {
      return res.status(403).json({ error: 'User is not a super admin' });
    }

    if (!superAdmin.is_active) {
      return res.status(403).json({ error: 'Super admin account is not active' });
    }

    req.superAdmin = superAdmin;
    next();
  } catch (error) {
    console.error('superAdminAuth error:', error);
    res.status(500).json({ error: 'Super admin authentication failed' });
  }
};

declare global {
  namespace Express {
    interface Request {
      superAdmin?: SuperAdmin;
    }
  }
}
