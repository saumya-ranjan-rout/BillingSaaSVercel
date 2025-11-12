import { Request, Response } from 'express';
import { SyncService } from '../services/sync.service';

export class SyncController {
  private syncService: SyncService;

  constructor() {
    this.syncService = new SyncService();
  }

  syncData = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const tenantId = (req as any).user.tenantId;
      const { entities } = req.body; // { invoices: [...], clients: [...] }
      
      const result = await this.syncService.syncData(tenantId, userId, entities);
      res.json({ success: true, result });
    } catch (err: unknown) {
      // Narrow the type
      const error = err instanceof Error ? err : new Error(String(err));
      res.status(500).json({ 
        success: false, 
        message: 'Sync failed',
        error: error.message 
      });
    }
  };

  getUpdates = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = (req as any).user.tenantId;
      const { lastSync } = req.query;
      
      const updates = await this.syncService.getUpdatesSince(
        tenantId, 
        new Date(lastSync as string)
      );
      
      res.json({ success: true, updates });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get updates',
        error: error.message
      });
    }
  };
}











// import { Request, Response } from 'express';
// import { SyncService } from '../services/sync.service';

// export class SyncController {
//   private syncService: SyncService;

//   constructor() {
//     this.syncService = new SyncService();
//   }

//   syncData = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const userId = (req as any).user.id;
//       const tenantId = (req as any).user.tenantId;
//       const { entities } = req.body; // { invoices: [...], clients: [...] }
      
//       const result = await this.syncService.syncData(tenantId, userId, entities);
//       res.json({ success: true, result });
//     } catch (error) {
//       res.status(500).json({ 
//         success: false, 
//         message: 'Sync failed',
//         error: error.message 
//       });
//     }
//   };

//   getUpdates = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const tenantId = (req as any).user.tenantId;
//       const { lastSync } = req.query;
      
//       const updates = await this.syncService.getUpdatesSince(
//         tenantId, 
//         new Date(lastSync as string)
//       );
      
//       res.json({ success: true, updates });
//     } catch (error) {
//       res.status(500).json({ 
//         success: false, 
//         message: 'Failed to get updates' 
//       });
//     }
//   };
// }
