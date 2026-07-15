import express from 'express';

import {
  getClientDepositsController,
  submitClientDepositController,
} from '../controllers/clientDeposits.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(clientAuthMiddleware);

router.get('/', getClientDepositsController);
router.post('/', submitClientDepositController);

export default router;
