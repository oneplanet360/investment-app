import { Router } from 'express';
import {
  signInAdminController,
  signOutAdminController,
  verifyController,
  signInClientController,
  signOutClientController,
  verifyClientController,
  adminImpersonateUserController,
} from '../controllers/auth/auth.controller';
import {
  adminAuthMiddleware,
  clientAuthMiddleware,
} from '../middlewares/auth.middleware';

const authRoutes = Router();

authRoutes.post('/admin/sign-in', signInAdminController);
authRoutes.post('/admin/sign-out', signOutAdminController);
authRoutes.get('/admin/verify', adminAuthMiddleware, verifyController);
authRoutes.post(
  '/admin/impersonate',
  adminAuthMiddleware,
  adminImpersonateUserController
);

authRoutes.post('/client/sign-in', signInClientController);
authRoutes.post('/client/sign-out', signOutClientController);
authRoutes.get('/client/verify', clientAuthMiddleware, verifyClientController);

export default authRoutes;
