import { Router } from 'express';
import { createInvestmentController, getClientInvestmentsController, closeInvestmentController } from '../controllers/clientInvestments.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(clientAuthMiddleware);

router.get('/', getClientInvestmentsController);
router.post('/create', createInvestmentController);
router.post('/close', closeInvestmentController);

export default router;
