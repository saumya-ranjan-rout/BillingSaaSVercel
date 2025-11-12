import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
// import { AuthenticatedRequest } from '../middleware/auth.middleware';
 
export class NotificationController {
  private notificationService: NotificationService;
 
  constructor() {
    this.notificationService = new NotificationService();
  }
 

    registerPushToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { token, platform } = req.body;
      
      await this.notificationService.registerPushToken(userId, token, platform);
      res.json({ success: true, message: 'Push token registered successfully' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to register push token'
      });
    }
  };
  // registerPushToken = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const userId = req.user!.id;
  //     const { token, platform } = req.body;
      
  //     await this.notificationService.registerPushToken(userId, token, platform);
  //     res.json({ success: true, message: 'Push token registered successfully' });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: 'Failed to register push token'
  //     });
  //   }
  // };
 
  sendPushNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      // Only admins and accountants can send notifications
      if (!['admin', 'accountant'].includes(req.user!.role)) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
        return;
      }
 
      const { userId, title, body, data } = req.body;
      await this.notificationService.sendPushNotification(userId, title, body, data);
      res.json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to send notification'
      });
    }
  };
 
  getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { page = 1, limit = 20 } = req.query;
      
      const notifications = await this.notificationService.getUserNotifications(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );
      
      res.json({ success: true, notifications });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications'
      });
    }
  };
 
  getUnreadCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const count = await this.notificationService.getUnreadCount(userId);
      res.json({ success: true, count });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unread count'
      });
    }
  };
 
  markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      await this.notificationService.markAsRead(userId, id);
      res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
  };
 
  markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.notificationService.markAllAsRead(userId);
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark notifications as read'
      });
    }
  };
 
  deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      await this.notificationService.deleteNotification(userId, id);
      res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification'
      });
    }
  };
}