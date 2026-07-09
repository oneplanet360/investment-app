import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from '../pages/page-not-found';
import { authenticationRoutePaths, protectedRoutesPaths } from './common/routePaths';
import AdminLayout from '../components/layouts/admin-layout';
import PublicRoute from './guard/public.route';
import ProtectedRoute from './guard/protected.route';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* authentication routes */}
        <Route element={<PublicRoute />}>
          {authenticationRoutePaths.map((route) => (
            <Route path={route.path} key={route.path} element={route.element} />
          ))}
        </Route>

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {protectedRoutesPaths.map((route) => (
              <Route path={route.path} key={route.path} element={route.element} />
            ))}
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}