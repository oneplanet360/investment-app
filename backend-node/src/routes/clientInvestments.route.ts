import { Router } from 'express';
import { createInvestmentController } from '../controllers/clientInvestments.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(clientAuthMiddleware);

router.post('/create', createInvestmentController);

export default router;
