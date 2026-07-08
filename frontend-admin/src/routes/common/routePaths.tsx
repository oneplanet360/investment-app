/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';

const Dashboard = lazy(() => import('../../pages/admin/dashboard'));
const Password = lazy(() => import('../../pages/admin/password'));
const Profile = lazy(() => import('../../pages/admin/profile'));
const SignInPage = lazy(() => import('../../pages/auth/signin-page'));
const UserDetail = lazy(() => import('../../components/common/details'));
const AllAgents = lazy(() => import('../../pages/admin/agent-management/all-agents'));
const AllInvestors = lazy(() => import('../../pages/admin/investors-management/all-investors'));
const AddAgent = lazy(() => import('../../pages/admin/agent-management/add-agent'));
const AgentResetPassword = lazy(() => import('../../pages/admin/agent-management/agent-password-reset'));
const InvestorResetPassword = lazy(() => import('../../pages/admin/investors-management/investor-password-reset'));
const Subscribers = lazy(() => import('../../pages/admin/subscribers'));
const InvestmentReport = lazy(() => import('../../pages/admin/investment-report'));
const AllDeposits = lazy(() => import('../../pages/admin/deposits/all'));
const PendingDeposits = lazy(() => import('../../pages/admin/deposits/pending'));
const ApprovedDeposits = lazy(() => import('../../pages/admin/deposits/approved'));
const SuccessfulDeposits = lazy(() => import('../../pages/admin/deposits/successful'));
const RejectedDeposits = lazy(() => import('../../pages/admin/deposits/rejected'));
const InitiatedDeposits = lazy(() => import('../../pages/admin/deposits/initiated'));
const DepositDetail = lazy(() => import('../../pages/admin/deposits/detail'));
const AllWithdrawals = lazy(() => import('../../pages/admin/withdrawals/all'));
const PendingWithdrawals = lazy(() => import('../../pages/admin/withdrawals/pending'));
const ApprovedWithdrawals = lazy(() => import('../../pages/admin/withdrawals/approved'));
const RejectedWithdrawals = lazy(() => import('../../pages/admin/withdrawals/rejected'));
const WithdrawalDetail = lazy(() => import('../../pages/admin/withdrawals/detail'));
const AllInvestments = lazy(() => import('../../pages/admin/investments/all'));
const ActiveInvestments = lazy(() => import('../../pages/admin/investments/active'));
const ClosedInvestments = lazy(() => import('../../pages/admin/investments/closed'));
const CompletedInvestments = lazy(() => import('../../pages/admin/investments/completed'));
const CloseRequests = lazy(() => import('../../pages/admin/investments/close-requests'));
const InvestmentDetail = lazy(() => import('../../pages/admin/investments/detail'));
import { AUTH_ROUTES, PROTECTED_ROUTES } from './routes';
const AllKyc = lazy(() => import('../../pages/admin/kyc/all'));
const PendingKyc = lazy(() => import('../../pages/admin/kyc/pending'));
const ApprovedKyc = lazy(() => import('../../pages/admin/kyc/approved'));
const RejectedKyc = lazy(() => import('../../pages/admin/kyc/rejected'));
const KycDetail = lazy(() => import('../../pages/admin/kyc/detail'));
const AllTopUps = lazy(() => import('../../pages/admin/topups/all'));
const TopUpDetail = lazy(() => import('../../pages/admin/topups/detail'));
const RoiLog = lazy(() => import('../../pages/admin/roi'));
const RoiSettings = lazy(() => import('../../pages/admin/roi/settings'));
const CommissionsLog = lazy(() => import('../../pages/admin/commissions'));
const CommissionSettings = lazy(() => import('../../pages/admin/commissions/settings'));
const Settings = lazy(() => import('../../pages/admin/settings'));
const AppearanceSettings = lazy(() => import('../../pages/admin/appearance'));
const InvestmentReportModule = lazy(() => import('../../pages/admin/reports/investments'));

const RoiReport = lazy(() => import('../../pages/admin/reports/roi'));
const CommissionsReport = lazy(() => import('../../pages/admin/reports/commissions'));
const WithdrawalsReport = lazy(() => import('../../pages/admin/reports/withdrawals'));
const AgentWithdrawals = lazy(() => import('../../pages/admin/withdrawals/agent'));
const AgentWithdrawalDetail = lazy(() => import('../../pages/admin/withdrawals/agent-detail'));

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