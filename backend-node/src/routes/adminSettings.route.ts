import { Router } from 'express';
import {
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/settings/adminSettings.controller';

const router = Router();

router.get('/', getAdminSettings);
router.put('/', updateAdminSettings);
router.patch('/', updateAdminSettings);

export default router;
