import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateTenantAccess } from '../middleware/tenant.middleware';
import { asyncErrorHandler } from '../middleware/error.middleware';
import { cacheMiddleware } from '../middleware/cache'; // ✅ add cache

const router = Router();
const notificationController = new NotificationController();

/**
* @route   POST /api/notifications/register-token
* @desc    Register a push notification token for a user
* @access  Private
*/
router.post(
  '/register-token',
  authenticateToken,
  validateTenantAccess,
  asyncErrorHandler(notificationController.registerPushToken)
);

/**
* @route   POST /api/notifications/send
* @desc    Send a push notification to a user (admin/accountant only)
* @access  Private (Admin/Accountant)
*/
router.post(
  '/send',
  authenticateToken,
  validateTenantAccess,
  asyncErrorHandler(notificationController.sendPushNotification)
);

/**
* @route   GET /api/notifications
* @desc    Get all notifications for the authenticated user
* @access  Private
*/
router.get(
  '/',
  authenticateToken,
  validateTenantAccess,
  cacheMiddleware('1m'), // ✅ cache notifications list briefly
  asyncErrorHandler(notificationController.getUserNotifications)
);

/**
* @route   GET /api/notifications/unread
* @desc    Get unread notifications count
* @access  Private
*/
router.get(
  '/unread',
  authenticateToken,
  validateTenantAccess,
  cacheMiddleware('30s'), // ✅ short cache for unread count
  asyncErrorHandler(notificationController.getUnreadCount)
);

/**
* @route   PUT /api/notifications/:id/read
* @desc    Mark a notification as read
* @access  Private
*/
router.put(
  '/:id/read',
  authenticateToken,
  validateTenantAccess,
  asyncErrorHandler(notificationController.markAsRead)
);

/**
* @route   PUT /api/notifications/read-all
* @desc    Mark all notifications as read
* @access  Private
*/
router.put(
  '/read-all',
  authenticateToken,
  validateTenantAccess,
  asyncErrorHandler(notificationController.markAllAsRead)
);

/**
* @route   DELETE /api/notifications/:id
* @desc    Delete a notification
* @access  Private
*/
router.delete(
  '/:id',
  authenticateToken,
  validateTenantAccess,
  asyncErrorHandler(notificationController.deleteNotification)
);

export default router;



