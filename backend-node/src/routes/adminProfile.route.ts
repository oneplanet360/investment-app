import { Router } from 'express';
import {
  getAdminProfileController,
  updateAdminProfileController,
  updateAdminPasswordController,
} from '../controllers/adminProfile.controller';
import { adminAuthMiddleware } from '../middlewares';

const router = Router();

// Secure all profile routes
router.use(adminAuthMiddleware);

router.get('/', getAdminProfileController);
router.put('/', updateAdminProfileController);
router.put('/password', updateAdminPasswordController);

export default router;
