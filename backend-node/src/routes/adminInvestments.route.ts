import { Router } from 'express';
import {
  getInvestmentsController,
  getInvestmentDetailController,
  updateInvestmentStatusController,
} from '../controllers/adminInvestments.controller';

const router = Router();

router.get('/', getInvestmentsController);
router.get('/:trxId', getInvestmentDetailController);
router.patch('/:trxId/status', updateInvestmentStatusController);

export default router;
