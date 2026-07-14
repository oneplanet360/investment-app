import { Router } from 'express';
import { assignInvestorController, getAllInvestorsController, assignAgentController, getAgentTreeController, searchUnassignedUserController, getAgentCommissionsController, getAgentDashboardStatsController, createInvestorController } from '../controllers/clientAgent.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(clientAuthMiddleware);

router.post('/assign-investor', assignInvestorController);
router.post('/create-investor', createInvestorController);
router.get('/investors', getAllInvestorsController);
router.post('/assign-sub-agent', assignAgentController);
router.get('/tree', getAgentTreeController);
router.get('/search-user', searchUnassignedUserController);
router.get('/commissions', getAgentCommissionsController);
router.get('/dashboard-stats', getAgentDashboardStatsController);

export default router;
