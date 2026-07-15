import { Router } from 'express';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import {
  getAdminNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
} from '../controllers/adminNotifications.controller';

const router = Router();

router.use(adminAuthMiddleware);

router.get('/', getAdminNotificationsController);
router.put('/read-all', markAllNotificationsReadController);
router.put('/:id/read', markNotificationReadController);

export default router;
