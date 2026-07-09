import { Router } from 'express';
import { getCommissionLogsController } from '../controllers/adminCommissions.controller';

const router = Router();

router.get('/', getCommissionLogsController);

export default router;
