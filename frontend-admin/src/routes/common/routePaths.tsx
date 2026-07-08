import Dashboard from '../../pages/admin/dashboard';
import Password from '../../pages/admin/password';
import Profile from '../../pages/admin/profile';
import SignInPage from '../../pages/auth/signin-page';
import UserDetail from '../../components/common/details';
import AllAgents from '../../pages/admin/agent-management/all-agents';
import AllInvestors from '../../pages/admin/investors-management/all-investors';
import AddAgent from '../../pages/admin/agent-management/add-agent';
import AgentResetPassword from '../../pages/admin/agent-management/agent-password-reset';
import InvestorResetPassword from '../../pages/admin/investors-management/investor-password-reset';
import Subscribers from '../../pages/admin/subscribers';
import InvestmentReport from '../../pages/admin/investment-report';
import AllDeposits from '../../pages/admin/deposits/all';
import PendingDeposits from '../../pages/admin/deposits/pending';
import ApprovedDeposits from '../../pages/admin/deposits/approved';
import SuccessfulDeposits from '../../pages/admin/deposits/successful';
import RejectedDeposits from '../../pages/admin/deposits/rejected';
import InitiatedDeposits from '../../pages/admin/deposits/initiated';
import DepositDetail from '../../pages/admin/deposits/detail';
import AllWithdrawals from '../../pages/admin/withdrawals/all';
import PendingWithdrawals from '../../pages/admin/withdrawals/pending';
import ApprovedWithdrawals from '../../pages/admin/withdrawals/approved';
import RejectedWithdrawals from '../../pages/admin/withdrawals/rejected';
import WithdrawalDetail from '../../pages/admin/withdrawals/detail';
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
  },
  {
    path: PROTECTED_ROUTES.ADMINAGENTS, element: <AllAgents />
  },
  {
    path: PROTECTED_ROUTES.ADMININVESTORS, element: <AllInvestors />
  },
  {
    path: PROTECTED_ROUTES.ADMINAGENTDETAILS, element: <UserDetail />
  },
  {
    path: PROTECTED_ROUTES.ADMININVESTORDETAILS, element: <UserDetail />
  },
  {
    path: PROTECTED_ROUTES.ADMINADDAGENT, element: <AddAgent />
  },
  {
    path: PROTECTED_ROUTES.ADMINAGENTPASSWORDRESET, element: <AgentResetPassword />
  },
  {
    path: PROTECTED_ROUTES.ADMININVESTORPASSWORDRESET, element: <InvestorResetPassword />
  },
  {
    path: PROTECTED_ROUTES.ADMINSUBSCRIBERS, element: <Subscribers />
  },
  { path: PROTECTED_ROUTES.ADMININVESTMENTREPORT, element: <InvestmentReport /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSALL, element: <AllDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSPENDING, element: <PendingDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSAPPROVED, element: <ApprovedDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSSUCCESSFUL, element: <SuccessfulDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSREJECTED, element: <RejectedDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSINITIATED, element: <InitiatedDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSDETAILS, element: <DepositDetail /> },
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSALL, element: <AllWithdrawals /> },
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSPENDING, element: <PendingWithdrawals /> },
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSAPPROVED, element: <ApprovedWithdrawals /> },
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSREJECTED, element: <RejectedWithdrawals /> },
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSDETAILS, element: <WithdrawalDetail /> }
];