import { Router } from 'express';
import {
  getWalletController,
  getWalletTransactionsController,
} from '../controllers/clientWallet.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(clientAuthMiddleware);

router.get('/', getWalletController);
router.get('/transactions', getWalletTransactionsController);

export default router;
