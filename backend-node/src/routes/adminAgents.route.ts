import { Router } from 'express';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import {
  createAgentController,
  getAgentsController,
  getAgentDetailController,
  resetAgentPasswordController,
  impersonateAgentController,
  toggleBanAgentController,
  sendNotificationAgentController,
  getAgentTreeAdminController
} from '../controllers/adminAgents.controller';

const router = Router();

// Protect all routes
router.use(adminAuthMiddleware);

router.post('/', createAgentController);
router.get('/', getAgentsController);
router.get('/:username', getAgentDetailController);
router.put('/:username/ban', toggleBanAgentController);
router.post('/:username/notification', sendNotificationAgentController);
router.post('/:username/impersonate', impersonateAgentController);
router.put('/:id/password-reset', resetAgentPasswordController);
router.get('/:username/tree', getAgentTreeAdminController);

export default router;
