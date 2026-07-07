import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from '../pages/page-not-found';
import { authenticationRoutePaths, protectedRoutesPaths } from './common/routePaths';
import AdminLayout from '../components/layouts/admin-layout';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* authentication routes */}
        <Route>
          {authenticationRoutePaths.map((route) => (
            <Route path={route.path} key={route.path} element={route.element} />
          ))}
        </Route>

        {/* protected routes */}
        <Route element={<AdminLayout />}>
          {protectedRoutesPaths.map((route) => (
            <Route path={route.path} key={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}