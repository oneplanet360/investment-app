import { Router } from 'express';
import {
  getAdminSettings,
  updateAdminSettings,
  getInvestmentSettings,
  updateInvestmentSettings,
} from '../controllers/settings/adminSettings.controller';

const router = Router();

router.get('/', getAdminSettings);
router.put('/', updateAdminSettings);
router.patch('/', updateAdminSettings);

router.get('/investment', getInvestmentSettings);
router.put('/investment', updateInvestmentSettings);
router.patch('/investment', updateInvestmentSettings);

export default router;
