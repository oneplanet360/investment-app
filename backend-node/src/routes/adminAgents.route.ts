import { Router } from 'express';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import {
  createAgentController,
  getAgentDetailController,
  getAgentsController,
  resetAgentPasswordController,
} from '../controllers/adminAgents.controller';

const router = Router();

// Protect all routes
router.use(adminAuthMiddleware);

router.post('/', createAgentController);
router.get('/', getAgentsController);
router.get('/:username', getAgentDetailController);
router.put('/:id/password-reset', resetAgentPasswordController);

export default router;
