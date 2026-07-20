import { Router } from 'express';
import { createInvestmentController, getClientInvestmentsController, closeInvestmentController } from '../controllers/clientInvestments.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';

import { investmentsStorage } from '../configs/cloudinary.config';

const upload = multer({ storage: investmentsStorage });

const router = Router();

router.use(clientAuthMiddleware);

router.get('/', getClientInvestmentsController);
router.post('/create', upload.single('paymentProof'), createInvestmentController);
router.post('/close', closeInvestmentController);

export default router;
