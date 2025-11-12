

import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();
const syncController = new SyncController();

router.post('/data', authenticateToken, syncController.syncData);
router.get('/updates', authenticateToken, cacheMiddleware('2 minutes'), syncController.getUpdates);

export default router;
