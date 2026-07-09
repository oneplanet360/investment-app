import { Router } from 'express';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import {
  createAgentController,
  getAgentsController,
  resetAgentPasswordController,
} from '../controllers/adminAgents.controller';

const router = Router();

// Protect all routes
router.use(adminAuthMiddleware);

router.post('/', createAgentController);
router.get('/', getAgentsController);
router.put('/:id/password-reset', resetAgentPasswordController);

export default router;
