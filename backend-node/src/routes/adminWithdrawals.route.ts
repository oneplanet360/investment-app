import { Router } from 'express';
import {
  getWithdrawalsController,
  getWithdrawalDetailController,
  updateWithdrawalStatusController,
} from '../controllers/adminWithdrawals.controller';

const router = Router();

router.get('/', getWithdrawalsController);
router.get('/:trxId', getWithdrawalDetailController);
router.patch('/:trxId/status', updateWithdrawalStatusController);

export default router;
