import { Router } from 'express';
import { submitKycController, getKycStatusController } from '../controllers/clientKyc.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(clientAuthMiddleware);

router.post('/', submitKycController);
router.get('/', getKycStatusController);

export default router;
