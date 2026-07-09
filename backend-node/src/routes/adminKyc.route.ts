import { Router } from 'express';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import {
  getKycSubmissionsController,
  getKycDetailController,
  updateKycStatusController,
} from '../controllers/adminKyc.controller';

const router = Router();

// Protect all routes
router.use(adminAuthMiddleware);

router.get('/', getKycSubmissionsController);
router.get('/:id', getKycDetailController);
router.put('/:id/status', updateKycStatusController);

export default router;
