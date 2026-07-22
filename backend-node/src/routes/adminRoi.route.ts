import { Router } from 'express';
import { getRoiLogsController, updateRoiStatusController } from '../controllers/adminRoi.controller';

const router = Router();

router.get('/', getRoiLogsController);
router.put('/:trxId/status', updateRoiStatusController);

export default router;
