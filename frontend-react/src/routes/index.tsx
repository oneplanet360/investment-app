import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "../pages/page-not-found";
import {
  adminAuthPaths,
  clientAuthPaths,
  protectedRoutesPaths,
  agentProtectedRoutesPaths,
  investorProtectedRoutesPaths,
} from "./common/routePaths";
import PublicRoute from "./guard/public.route";
import ProtectedRoute from "./guard/protected.route";
import ClientPublicRoute from "./guard/client-public.route";
import ClientProtectedRoute from "./guard/client-protected.route";
import AdminLayout from "../layout/admin-layout";
import AgentLayout from "../layout/agent-layout";
import InvestorLayout from "../layout/investor-layout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin authentication routes */}
        <Route element={<PublicRoute />}>
          {adminAuthPaths.map((route) => (
            <Route path={route.path} key={route.path} element={route.element} />
          ))}
        </Route>

        {/* Client authentication routes */}
        <Route element={<ClientPublicRoute />}>
          {clientAuthPaths.map((route) => (
            <Route path={route.path} key={route.path} element={route.element} />
          ))}
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {protectedRoutesPaths.map((route) => (
              <Route
                path={route.path}
                key={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        {/* Agent protected routes */}
        <Route element={<ClientProtectedRoute allowedRole="AGENT" />}>
          <Route element={<AgentLayout />}>
            {agentProtectedRoutesPaths.map((route) => (
              <Route
                path={route.path}
                key={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        {/* Investor protected routes */}
        <Route element={<ClientProtectedRoute allowedRole="INVESTOR" />}>
          <Route element={<InvestorLayout />}>
            {investorProtectedRoutesPaths.map((route) => (
              <Route
                path={route.path}
                key={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
