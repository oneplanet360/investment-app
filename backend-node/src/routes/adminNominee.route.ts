import { Router } from 'express';
import {
  getNomineeSubmissionsController,
  getNomineeDetailController,
  updateNomineeStatusController,
} from '../controllers/adminNominee.controller';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(adminAuthMiddleware);

router.get('/', getNomineeSubmissionsController);
router.get('/:id', getNomineeDetailController);
router.put('/:id/status', updateNomineeStatusController);

export default router;
