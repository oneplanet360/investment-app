import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { authenticationRoutePaths } from './common/routePaths';
import InvestorLayout from '../components/layouts/investor-layout';
import AgentLayout from '../components/layouts/agent-layout';
import InvestorDashboard from '../pages/investor/dashboard';
import AgentDashboard from '../pages/agent/dashboard';
import ProfileSetting from '../pages/common/profile-setting';
import AddInvestor from '../pages/agent/add-investor';

// Common Blank Pages
import ChangePassword from '../pages/common/change-password';
import TwoFASecurity from '../pages/common/2fa-security';

// Agent Blank Pages
import AllInvestors from '../pages/agent/all-investors';
import Team from '../pages/agent/team';
import AgentCommissions from '../pages/agent/commissions';
import AgentWallet from '../pages/agent/wallet';
import AgentWithdrawals from '../pages/agent/withdrawals';

// Investor Blank Pages
import Investments from '../pages/investor/investments';
import TopUps from '../pages/investor/top-ups';
import RoiHistory from '../pages/investor/roi-history';
import InvestorWallet from '../pages/investor/wallet';
import InvestorWithdrawals from '../pages/investor/withdrawals';
import KYC from '../pages/investor/kyc';

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
          <Route path="/investor/profile-setting" element={<ProfileSetting />} />
          <Route path="/investor/change-password" element={<ChangePassword />} />
          <Route path="/investor/2fa-security" element={<TwoFASecurity />} />
          
          <Route path="/investor/investments" element={<Investments />} />
          <Route path="/investor/top-ups" element={<TopUps />} />
          <Route path="/investor/roi-history" element={<RoiHistory />} />
          <Route path="/investor/wallet" element={<InvestorWallet />} />
          <Route path="/investor/withdrawals" element={<InvestorWithdrawals />} />
          <Route path="/investor/kyc" element={<KYC />} />
        </Route>

        {/* Agent Panel Routes */}
        <Route element={<AgentLayout />}>
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/profile-setting" element={<ProfileSetting />} />
          <Route path="/agent/change-password" element={<ChangePassword />} />
          <Route path="/agent/2fa-security" element={<TwoFASecurity />} />
          
          <Route path="/agent/add-investor" element={<AddInvestor />} />
          <Route path="/agent/all-investors" element={<AllInvestors />} />
          <Route path="/agent/team" element={<Team />} />
          <Route path="/agent/commissions" element={<AgentCommissions />} />
          <Route path="/agent/wallet" element={<AgentWallet />} />
          <Route path="/agent/withdrawals" element={<AgentWithdrawals />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}