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
import AllInvestments from '../../pages/admin/investments/all';
import ActiveInvestments from '../../pages/admin/investments/active';
import ClosedInvestments from '../../pages/admin/investments/closed';
import CompletedInvestments from '../../pages/admin/investments/completed';
import CloseRequests from '../../pages/admin/investments/close-requests';
import InvestmentDetail from '../../pages/admin/investments/detail';
import { AUTH_ROUTES, PROTECTED_ROUTES } from './routes';
import AllKyc from '../../pages/admin/kyc/all';
import PendingKyc from '../../pages/admin/kyc/pending';
import ApprovedKyc from '../../pages/admin/kyc/approved';
import RejectedKyc from '../../pages/admin/kyc/rejected';
import KycDetail from '../../pages/admin/kyc/detail';
import AllTopUps from '../../pages/admin/topups/all';
import TopUpDetail from '../../pages/admin/topups/detail';
import RoiLog from '../../pages/admin/roi';
import RoiSettings from '../../pages/admin/roi/settings';
import CommissionsLog from '../../pages/admin/commissions';
import CommissionSettings from '../../pages/admin/commissions/settings';
import Settings from '../../pages/admin/settings';
import AppearanceSettings from '../../pages/admin/appearance';
import InvestmentReportModule from '../../pages/admin/reports/investments';

import RoiReport from '../../pages/admin/reports/roi';
import CommissionsReport from '../../pages/admin/reports/commissions';
import WithdrawalsReport from '../../pages/admin/reports/withdrawals';
import AgentWithdrawals from '../../pages/admin/withdrawals/agent';
import AgentWithdrawalDetail from '../../pages/admin/withdrawals/agent-detail';

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.ADMINSIGNIN, element: <SignInPage /> },
];

export const protectedRoutesPaths = [
  { path: PROTECTED_ROUTES.ADMINDASHBOARD, element: <Dashboard /> },
  { path: PROTECTED_ROUTES.ADMINPASSWORDCHANGE, element: <Password /> },
  { path: PROTECTED_ROUTES.ADMINPROFILE, element: <Profile /> },

  // Agent Management — static before dynamic
  { path: PROTECTED_ROUTES.ADMINAGENTS, element: <AllAgents /> },
  { path: PROTECTED_ROUTES.ADMINADDAGENT, element: <AddAgent /> },
  { path: PROTECTED_ROUTES.ADMINAGENTPASSWORDRESET, element: <AgentResetPassword /> },
  { path: PROTECTED_ROUTES.ADMINAGENTDETAILS, element: <UserDetail /> },

  // Investor Management — static before dynamic
  { path: PROTECTED_ROUTES.ADMININVESTORS, element: <AllInvestors /> },
  { path: PROTECTED_ROUTES.ADMININVESTORPASSWORDRESET, element: <InvestorResetPassword /> },
  { path: PROTECTED_ROUTES.ADMININVESTORDETAILS, element: <UserDetail /> },

  { path: PROTECTED_ROUTES.ADMINSUBSCRIBERS, element: <Subscribers /> },
  { path: PROTECTED_ROUTES.ADMININVESTMENTREPORT, element: <InvestmentReport /> },

  // Investments
  { path: PROTECTED_ROUTES.ADMININVESTMENTSALL, element: <AllInvestments /> },
  { path: PROTECTED_ROUTES.ADMININVESTMENTSACTIVE, element: <ActiveInvestments /> },
  { path: PROTECTED_ROUTES.ADMININVESTMENTSCLOSED, element: <ClosedInvestments /> },
  { path: PROTECTED_ROUTES.ADMININVESTMENTSCOMPLETED, element: <CompletedInvestments /> },
  { path: PROTECTED_ROUTES.ADMININVESTMENTSCLOSEREQUESTS, element: <CloseRequests /> },
  { path: PROTECTED_ROUTES.ADMININVESTMENTSDETAILS, element: <InvestmentDetail /> },

  // Deposits
  { path: PROTECTED_ROUTES.ADMINDEPOSITSALL, element: <AllDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSPENDING, element: <PendingDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSAPPROVED, element: <ApprovedDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSSUCCESSFUL, element: <SuccessfulDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSREJECTED, element: <RejectedDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSINITIATED, element: <InitiatedDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSDETAILS, element: <DepositDetail /> },

  // Withdrawals (Investor)
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSALL, element: <AllWithdrawals /> },
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSPENDING, element: <PendingWithdrawals /> },
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSAPPROVED, element: <ApprovedWithdrawals /> },
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSREJECTED, element: <RejectedWithdrawals /> },
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSDETAILS, element: <WithdrawalDetail /> },

  // Agent Withdrawals
  { path: PROTECTED_ROUTES.ADMINAGENTWITHDRAWALS, element: <AgentWithdrawals /> },
  { path: PROTECTED_ROUTES.ADMINAGENTWITHDRAWALSDETAILS, element: <AgentWithdrawalDetail /> },

  // KYC
  { path: PROTECTED_ROUTES.ADMINKYCALL, element: <AllKyc /> },
  { path: PROTECTED_ROUTES.ADMINKYCPENDING, element: <PendingKyc /> },
  { path: PROTECTED_ROUTES.ADMINKYCAPPROVED, element: <ApprovedKyc /> },
  { path: PROTECTED_ROUTES.ADMINKYCREJECTED, element: <RejectedKyc /> },
  { path: PROTECTED_ROUTES.ADMINKYCDETAILS, element: <KycDetail /> },

  // Top-ups
  { path: PROTECTED_ROUTES.ADMINTOPUPSALL, element: <AllTopUps /> },
  { path: PROTECTED_ROUTES.ADMINTOPUPSDETAILS, element: <TopUpDetail /> },

  // ROI
  { path: PROTECTED_ROUTES.ADMINROILOG, element: <RoiLog /> },
  { path: PROTECTED_ROUTES.ADMINROISETTINGS, element: <RoiSettings /> },

  // Commissions
  { path: PROTECTED_ROUTES.ADMINCOMMISSIONSLOG, element: <CommissionsLog /> },
  { path: PROTECTED_ROUTES.ADMINCOMMISSIONSSETTINGS, element: <CommissionSettings /> },

  // System Settings
  { path: PROTECTED_ROUTES.ADMINSETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.ADMINAPPEARANCESETTINGS, element: <AppearanceSettings /> },

  // Reports
  { path: PROTECTED_ROUTES.ADMINREPORTINVESTMENTS, element: <InvestmentReportModule /> },
  { path: PROTECTED_ROUTES.ADMINREPORTROI, element: <RoiReport /> },
  { path: PROTECTED_ROUTES.ADMINREPORTCOMMISSIONS, element: <CommissionsReport /> },
  { path: PROTECTED_ROUTES.ADMINREPORTWITHDRAWALS, element: <WithdrawalsReport /> },
];