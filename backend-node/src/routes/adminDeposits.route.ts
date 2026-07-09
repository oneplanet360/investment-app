import { Router } from 'express';
import {
  getDepositsController,
  getDepositDetailController,
  updateDepositStatusController,
} from '../controllers/adminDeposits.controller';

const router = Router();

router.get('/', getDepositsController);
router.get('/:trxId', getDepositDetailController);
router.patch('/:trxId/status', updateDepositStatusController);

export default router;
