import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Subscription } from '../entities/Subscription';
import { MoreThan, In } from 'typeorm';

export const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const subscriptionRepo = AppDataSource.getRepository(Subscription);
    const now = new Date();

    const sub = await subscriptionRepo.findOne({
      where: {
        tenantId,
        status: In(['active', 'trial']),
        endDate: MoreThan(now), // endDate > current time
      },
      order: { endDate: 'DESC' },
    });

    if (!sub) {
      return res.status(403).json({ message: 'Your subscription has expired or not found.' });
    }

    next();
  } catch (err) {
    console.error('Subscription check error:', err);
    return res.status(500).json({ message: 'Error verifying subscription status.' });
  }
};
