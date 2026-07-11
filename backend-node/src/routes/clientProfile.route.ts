import { Router } from 'express';
import {
  getProfileController,
  updateProfileController,
  updatePasswordController,
} from '../controllers/clientProfile.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(clientAuthMiddleware);

router.get('/', getProfileController);
router.put('/', updateProfileController);
router.put('/password', updatePasswordController);

export default router;
