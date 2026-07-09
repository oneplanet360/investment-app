import { Router } from 'express';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import {
  getInvestorsController,
  resetInvestorPasswordController,
} from '../controllers/adminInvestors.controller';

const router = Router();

// Protect all routes
router.use(adminAuthMiddleware);

router.get('/', getInvestorsController);
router.put('/:id/password-reset', resetInvestorPasswordController);

export default router;
