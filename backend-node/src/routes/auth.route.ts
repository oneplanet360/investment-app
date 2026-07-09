import { Router } from 'express';
import {
  signInAdminController,
  signOutAdminController,
  verifyController,
} from '../controllers/auth/auth.controller';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';

const authRoutes = Router();

authRoutes.post('/admin/sign-in', signInAdminController);
authRoutes.post('/admin/sign-out', signOutAdminController);
authRoutes.get('/admin/verify', adminAuthMiddleware, verifyController);

export default authRoutes;
