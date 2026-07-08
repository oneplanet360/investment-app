import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { authenticationRoutePaths } from './common/routePaths';
import InvestorLayout from '../components/layouts/investor-layout';
import AgentLayout from '../components/layouts/agent-layout';
import InvestorDashboard from '../pages/investor/dashboard';
import AgentDashboard from '../pages/agent/dashboard';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route>
          {authenticationRoutePaths.map((route) => (
            <Route path={route.path} key={route.path} element={route.element} />
          ))}
        </Route>

        {/* Investor Panel Routes */}
        <Route element={<InvestorLayout />}>
          <Route path="/investor/dashboard" element={<InvestorDashboard />} />
          {/* Additional investor subpages will go here */}
        </Route>

        {/* Agent Panel Routes */}
        <Route element={<AgentLayout />}>
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          {/* Additional agent subpages will go here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}