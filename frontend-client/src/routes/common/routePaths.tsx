import SignInPage from '../../pages/auth/signin-page';
import { AUTH_ROUTES } from './routes';

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGNIN, element: <SignInPage /> },
];
