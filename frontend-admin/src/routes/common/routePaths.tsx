import Dashboard from '../../pages/admin/dashboard';
import Password from '../../pages/admin/password';
import Profile from '../../pages/admin/profile';
import SignInPage from '../../pages/auth/signin-page';
import { AUTH_ROUTES, PROTECTED_ROUTES } from './routes';

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.ADMINSIGNIN, element: <SignInPage /> },
];

export const protectedRoutesPaths = [
  { path: PROTECTED_ROUTES.ADMINDASHBOARD, element: <Dashboard /> },
  {
    path: PROTECTED_ROUTES.ADMINPASSWORDCHANGE,
    element: <Password />
  },
  {
    path: PROTECTED_ROUTES.ADMINPROFILE, element: <Profile />
  }

];