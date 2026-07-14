import { Router } from 'express';
import { getClientRoiController } from '../controllers/clientRoi.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(clientAuthMiddleware);

router.get('/', getClientRoiController);

export default router;
