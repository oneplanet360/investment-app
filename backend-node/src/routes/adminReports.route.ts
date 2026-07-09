import { Router } from 'express';
import {
  getInvestmentReportController,
  getRoiReportController,
  getWithdrawalReportController,
  getCommissionReportController,
} from '../controllers/adminReports.controller';

const router = Router();

router.get('/investments', getInvestmentReportController);
router.get('/roi', getRoiReportController);
router.get('/withdrawals', getWithdrawalReportController);
router.get('/commissions', getCommissionReportController);

export default router;
