import { Router } from 'express';
import { getAdminDashboardController } from '../controllers/adminDashboard.controller';
import { adminAuthMiddleware } from '../middlewares';

const router = Router();
router.use(adminAuthMiddleware);
router.get('/', getAdminDashboardController);
export default router;
