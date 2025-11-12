import { getRepository } from 'typeorm';
import * as admin from 'firebase-admin';
import { User } from '../entities/User';
import { Notification } from '../entities/Notification';
 
export class NotificationService {
  // Remove repository initialization from constructor
  // We'll get repositories when needed in each method
 
  async registerPushToken(userId: string, token: string, platform: string) {
    const userRepository = getRepository(User);
    await userRepository.update(userId, {
      pushToken: token
    });
  }
 
  async sendPushNotification(userId: string, title: string, body: string, data: any = {}) {
    const userRepository = getRepository(User);
    const notificationRepository = getRepository(Notification);
    
    const user = await userRepository.findOne({
      where: { id: userId }
    });
    
    if (!user || !user.pushToken) {
      throw new Error('User or push token not found');
    }
 
    try {
      // Send via FCM
      const message: admin.messaging.Message = {
        token: user.pushToken,
        notification: {
          title,
          body
        },
        data,
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };
 
      await admin.messaging().send(message);
 
      // Save to database
      const notification = notificationRepository.create({
        title,
        body,
        data,
        user,
        type: data.type || 'general',
        priority: data.priority || 'normal'
      });
 
      await notificationRepository.save(notification);
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw new Error('Failed to send push notification');
    }
  }
 
  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const notificationRepository = getRepository(Notification);
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await notificationRepository.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });
 
    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
 
  async getUnreadCount(userId: string) {
    const notificationRepository = getRepository(Notification);
    return await notificationRepository.count({
      where: {
        user: { id: userId },
        isRead: false
      }
    });
  }
 
  async markAsRead(userId: string, notificationId: string) {
    const notificationRepository = getRepository(Notification);
    const notification = await notificationRepository.findOne({
      where: {
        id: notificationId,
        user: { id: userId }
      }
    });
 
    if (!notification) {
      throw new Error('Notification not found');
    }
 
    await notificationRepository.update(notificationId, { isRead: true });
  }
 
  async markAllAsRead(userId: string) {
    const notificationRepository = getRepository(Notification);
    await notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('userId = :userId', { userId })
      .andWhere('isRead = :isRead', { isRead: false })
      .execute();
  }
 
  async deleteNotification(userId: string, notificationId: string) {
    const notificationRepository = getRepository(Notification);
    const notification = await notificationRepository.findOne({
      where: {
        id: notificationId,
        user: { id: userId }
      }
    });
 
    if (!notification) {
      throw new Error('Notification not found');
    }
 
    await notificationRepository.delete(notificationId);
  }
 
  // Method to send notifications based on business events
  async sendInvoiceDueNotification(userId: string, invoiceId: string, invoiceNumber: string) {
    await this.sendPushNotification(
      userId,
      'Invoice Due',
      `Invoice ${invoiceNumber} is due soon`,
      {
        type: 'invoice_due',
        invoiceId,
        priority: 'high'
      }
    );
  }
 
  // Method to send payment received notification
  async sendPaymentReceivedNotification(userId: string, invoiceId: string, invoiceNumber: string, amount: number) {
    await this.sendPushNotification(
      userId,
      'Payment Received',
      `Payment of $${amount} received for invoice ${invoiceNumber}`,
      {
        type: 'payment_received',
        invoiceId,
        priority: 'normal'
      }
    );
  }
}