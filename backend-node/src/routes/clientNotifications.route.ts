import { Router } from 'express';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';
import {
  getClientNotificationsController,
  markNotificationReadController,
} from '../controllers/clientNotifications.controller';

const router = Router();

router.use(clientAuthMiddleware);

router.get('/', getClientNotificationsController);
router.put('/:id/read', markNotificationReadController);

export default router;
