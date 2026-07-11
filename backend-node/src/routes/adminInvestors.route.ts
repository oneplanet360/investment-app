import { Router } from 'express';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import {
  getInvestorsController,
  getInvestorDetailController,
  resetInvestorPasswordController,
  impersonateInvestorController,
  toggleBanInvestorController,
  sendNotificationInvestorController
} from '../controllers/adminInvestors.controller';

const router = Router();

// Protect all routes
router.use(adminAuthMiddleware);

router.get('/', getInvestorsController);
router.get('/:username', getInvestorDetailController);
router.put('/:username/ban', toggleBanInvestorController);
router.post('/:username/notification', sendNotificationInvestorController);
router.post('/:username/impersonate', impersonateInvestorController);
router.put('/:id/password-reset', resetInvestorPasswordController);

export default router;
