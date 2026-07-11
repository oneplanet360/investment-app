import { Router } from 'express';
import {
  getWithdrawalsController,
  requestWithdrawalController,
} from '../controllers/clientWithdrawal.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(clientAuthMiddleware);

router.get('/', getWithdrawalsController);
router.post('/', requestWithdrawalController);

export default router;
