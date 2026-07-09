import { Router } from 'express';
import { getRoiLogsController } from '../controllers/adminRoi.controller';

const router = Router();

router.get('/', getRoiLogsController);

export default router;
