/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";

const Dashboard = lazy(() => import("../../pages/admin/dashboard"));
const Password = lazy(() => import("../../pages/admin/password"));
const Profile = lazy(() => import("../../pages/admin/profile"));
const SignInPage = lazy(() => import("../../pages/admin/auth/signin-page"));
const UserDetail = lazy(() => import("../../components/admin/details"));
const AllAgents = lazy(
  () => import("../../pages/admin/agent-management/all-agents"),
);
const AllInvestors = lazy(
  () => import("../../pages/admin/investors-management/all-investors"),
);
const AddAgent = lazy(
  () => import("../../pages/admin/agent-management/add-agent"),
);
const AgentResetPassword = lazy(
  () => import("../../pages/admin/agent-management/agent-password-reset"),
);
const InvestorResetPassword = lazy(
  () =>
    import("../../pages/admin/investors-management/investor-password-reset"),
);
const Subscribers = lazy(() => import("../../pages/admin/subscribers"));
const InvestmentReport = lazy(
  () => import("../../pages/admin/investment-report"),
);
const AllDeposits = lazy(() => import("../../pages/admin/deposits/all"));
const PendingDeposits = lazy(
  () => import("../../pages/admin/deposits/pending"),
);
const ApprovedDeposits = lazy(
  () => import("../../pages/admin/deposits/approved"),
);
const SuccessfulDeposits = lazy(
  () => import("../../pages/admin/deposits/successful"),
);
const RejectedDeposits = lazy(
  () => import("../../pages/admin/deposits/rejected"),
);
const InitiatedDeposits = lazy(
  () => import("../../pages/admin/deposits/initiated"),
);
const DepositDetail = lazy(() => import("../../pages/admin/deposits/detail"));
const AllWithdrawals = lazy(() => import("../../pages/admin/withdrawals/all"));
const PendingWithdrawals = lazy(
  () => import("../../pages/admin/withdrawals/pending"),
);
const ApprovedWithdrawals = lazy(
  () => import("../../pages/admin/withdrawals/approved"),
);
const RejectedWithdrawals = lazy(
  () => import("../../pages/admin/withdrawals/rejected"),
);
const WithdrawalDetail = lazy(
  () => import("../../pages/admin/withdrawals/detail"),
);
const AllInvestments = lazy(() => import("../../pages/admin/investments/all"));
const ActiveInvestments = lazy(
  () => import("../../pages/admin/investments/active"),
);
const ClosedInvestments = lazy(
  () => import("../../pages/admin/investments/closed"),
);
const CompletedInvestments = lazy(
  () => import("../../pages/admin/investments/completed"),
);
const CloseRequests = lazy(
  () => import("../../pages/admin/investments/close-requests"),
);
const InvestmentDetail = lazy(
  () => import("../../pages/admin/investments/detail"),
);
import {
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  AGENT_PROTECTED_ROUTES,
  INVESTOR_PROTECTED_ROUTES,
} from "./routes";
import ClientSignInPage from "../../pages/client/auth/signin-page";
const AllKyc = lazy(() => import("../../pages/admin/kyc/all"));
const PendingKyc = lazy(() => import("../../pages/admin/kyc/pending"));
const ApprovedKyc = lazy(() => import("../../pages/admin/kyc/approved"));
const RejectedKyc = lazy(() => import("../../pages/admin/kyc/rejected"));
const KycDetail = lazy(() => import("../../pages/admin/kyc/detail"));
const AllTopUps = lazy(() => import("../../pages/admin/topups/all"));
const TopUpDetail = lazy(() => import("../../pages/admin/topups/detail"));
const RoiLog = lazy(() => import("../../pages/admin/roi"));
const CommissionsLog = lazy(() => import("../../pages/admin/commissions"));
const InvestmentSettings = lazy(
  () => import("../../pages/admin/investment-settings"),
);
const AdminSettings = lazy(() => import("../../pages/admin/admin-settings"));
const ClientSettings = lazy(() => import("../../pages/admin/client-settings"));
const InvestmentReportModule = lazy(
  () => import("../../pages/admin/reports/investments"),
);

const RoiReport = lazy(() => import("../../pages/admin/reports/roi"));
const CommissionsReport = lazy(
  () => import("../../pages/admin/reports/commissions"),
);
const WithdrawalsReport = lazy(
  () => import("../../pages/admin/reports/withdrawals"),
);
const AgentWithdrawals = lazy(
  () => import("../../pages/admin/withdrawals/agent"),
);
const AgentWithdrawalDetail = lazy(
  () => import("../../pages/admin/withdrawals/agent-detail"),
);

// Client (Agent) Pages
const ClientAgentDashboard = lazy(
  () => import("../../pages/client/agent/dashboard"),
);
const ClientAgentAllInvestors = lazy(
  () => import("../../pages/client/agent/all-investors"),
);
const ClientAgentCommissions = lazy(
  () => import("../../pages/client/agent/commissions"),
);
const ClientAgentTeam = lazy(() => import("../../pages/client/agent/team"));
const ClientAgentWallet = lazy(() => import("../../pages/client/agent/wallet"));
const ClientAgentWithdrawals = lazy(
  () => import("../../pages/client/agent/withdrawals"),
);

// Client (Investor) Pages
const ClientInvestorDashboard = lazy(
  () => import("../../pages/client/investor/dashboard"),
);
const ClientInvestorInvestments = lazy(
  () => import("../../pages/client/investor/investments"),
);
const ClientInvestorRoiHistory = lazy(
  () => import("../../pages/client/investor/roi-history"),
);
const ClientInvestorTopUps = lazy(
  () => import("../../pages/client/investor/top-ups"),
);
const ClientInvestorWallet = lazy(
  () => import("../../pages/client/investor/wallet"),
);
const ClientInvestorWithdrawals = lazy(
  () => import("../../pages/client/investor/withdrawals"),
);

// Client (Shared) Pages
const ClientProfileSetting = lazy(
  () => import("../../pages/client/shared/profile-setting"),
);
const ClientChangePassword = lazy(
  () => import("../../pages/client/shared/change-password"),
);
const ClientTwoFASecurity = lazy(
  () => import("../../pages/client/shared/2fa-security"),
);
const ClientNotifications = lazy(
  () => import("../../pages/client/shared/notifications"),
);
const ClientSharedKyc = lazy(() => import("../../pages/client/shared/kyc"));

export const adminAuthPaths = [
  { path: AUTH_ROUTES.ADMINSIGNIN, element: <SignInPage /> },
];

export const clientAuthPaths = [
  { path: AUTH_ROUTES.CLIENTSIGIN, element: <ClientSignInPage /> },
];

export const protectedRoutesPaths = [
  { path: PROTECTED_ROUTES.ADMINDASHBOARD, element: <Dashboard /> },
  { path: PROTECTED_ROUTES.ADMINPASSWORDCHANGE, element: <Password /> },
  { path: PROTECTED_ROUTES.ADMINPROFILE, element: <Profile /> },

  // Agent Management — static before dynamic
  { path: PROTECTED_ROUTES.ADMINAGENTS, element: <AllAgents /> },
  { path: PROTECTED_ROUTES.ADMINADDAGENT, element: <AddAgent /> },
  {
    path: PROTECTED_ROUTES.ADMINAGENTPASSWORDRESET,
    element: <AgentResetPassword />,
  },
  { path: PROTECTED_ROUTES.ADMINAGENTDETAILS, element: <UserDetail /> },

  // Investor Management — static before dynamic
  { path: PROTECTED_ROUTES.ADMININVESTORS, element: <AllInvestors /> },
  {
    path: PROTECTED_ROUTES.ADMININVESTORPASSWORDRESET,
    element: <InvestorResetPassword />,
  },
  { path: PROTECTED_ROUTES.ADMININVESTORDETAILS, element: <UserDetail /> },

  { path: PROTECTED_ROUTES.ADMINSUBSCRIBERS, element: <Subscribers /> },
  {
    path: PROTECTED_ROUTES.ADMININVESTMENTREPORT,
    element: <InvestmentReport />,
  },

  // Investments
  { path: PROTECTED_ROUTES.ADMININVESTMENTSALL, element: <AllInvestments /> },
  {
    path: PROTECTED_ROUTES.ADMININVESTMENTSACTIVE,
    element: <ActiveInvestments />,
  },
  {
    path: PROTECTED_ROUTES.ADMININVESTMENTSCLOSED,
    element: <ClosedInvestments />,
  },
  {
    path: PROTECTED_ROUTES.ADMININVESTMENTSCOMPLETED,
    element: <CompletedInvestments />,
  },
  {
    path: PROTECTED_ROUTES.ADMININVESTMENTSCLOSEREQUESTS,
    element: <CloseRequests />,
  },
  {
    path: PROTECTED_ROUTES.ADMININVESTMENTSDETAILS,
    element: <InvestmentDetail />,
  },

  // Deposits
  { path: PROTECTED_ROUTES.ADMINDEPOSITSALL, element: <AllDeposits /> },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSPENDING, element: <PendingDeposits /> },
  {
    path: PROTECTED_ROUTES.ADMINDEPOSITSAPPROVED,
    element: <ApprovedDeposits />,
  },
  {
    path: PROTECTED_ROUTES.ADMINDEPOSITSSUCCESSFUL,
    element: <SuccessfulDeposits />,
  },
  {
    path: PROTECTED_ROUTES.ADMINDEPOSITSREJECTED,
    element: <RejectedDeposits />,
  },
  {
    path: PROTECTED_ROUTES.ADMINDEPOSITSINITIATED,
    element: <InitiatedDeposits />,
  },
  { path: PROTECTED_ROUTES.ADMINDEPOSITSDETAILS, element: <DepositDetail /> },

  // Withdrawals (Investor)
  { path: PROTECTED_ROUTES.ADMINWITHDRAWALSALL, element: <AllWithdrawals /> },
  {
    path: PROTECTED_ROUTES.ADMINWITHDRAWALSPENDING,
    element: <PendingWithdrawals />,
  },
  {
    path: PROTECTED_ROUTES.ADMINWITHDRAWALSAPPROVED,
    element: <ApprovedWithdrawals />,
  },
  {
    path: PROTECTED_ROUTES.ADMINWITHDRAWALSREJECTED,
    element: <RejectedWithdrawals />,
  },
  {
    path: PROTECTED_ROUTES.ADMINWITHDRAWALSDETAILS,
    element: <WithdrawalDetail />,
  },

  // Agent Withdrawals
  {
    path: PROTECTED_ROUTES.ADMINAGENTWITHDRAWALS,
    element: <AgentWithdrawals />,
  },
  {
    path: PROTECTED_ROUTES.ADMINAGENTWITHDRAWALSDETAILS,
    element: <AgentWithdrawalDetail />,
  },

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

  // Commissions
  { path: PROTECTED_ROUTES.ADMINCOMMISSIONSLOG, element: <CommissionsLog /> },

  // System Settings
  {
    path: PROTECTED_ROUTES.ADMINSETTINGSINVESTMENT,
    element: <InvestmentSettings />,
  },
  { path: PROTECTED_ROUTES.ADMINSETTINGSADMIN, element: <AdminSettings /> },
  { path: PROTECTED_ROUTES.ADMINSETTINGSCLIENT, element: <ClientSettings /> },

  // Reports
  {
    path: PROTECTED_ROUTES.ADMINREPORTINVESTMENTS,
    element: <InvestmentReportModule />,
  },
  { path: PROTECTED_ROUTES.ADMINREPORTROI, element: <RoiReport /> },
  {
    path: PROTECTED_ROUTES.ADMINREPORTCOMMISSIONS,
    element: <CommissionsReport />,
  },
  {
    path: PROTECTED_ROUTES.ADMINREPORTWITHDRAWALS,
    element: <WithdrawalsReport />,
  },
];

const ClientAgentAssignUser = lazy(
  () => import("../../pages/client/agent/assign-user"),
);
const ClientAgentTree = lazy(() => import("../../pages/client/agent/tree"));

export const agentProtectedRoutesPaths = [
  { path: AGENT_PROTECTED_ROUTES.DASHBOARD, element: <ClientAgentDashboard /> },
  {
    path: AGENT_PROTECTED_ROUTES.ASSIGN_USER,
    element: <ClientAgentAssignUser />,
  },
  { path: AGENT_PROTECTED_ROUTES.TREE, element: <ClientAgentTree /> },
  {
    path: AGENT_PROTECTED_ROUTES.ALL_INVESTORS,
    element: <ClientAgentAllInvestors />,
  },
  {
    path: AGENT_PROTECTED_ROUTES.COMMISSIONS,
    element: <ClientAgentCommissions />,
  },
  { path: AGENT_PROTECTED_ROUTES.TEAM, element: <ClientAgentTeam /> },
  { path: AGENT_PROTECTED_ROUTES.WALLET, element: <ClientAgentWallet /> },
  {
    path: AGENT_PROTECTED_ROUTES.WITHDRAWALS,
    element: <ClientAgentWithdrawals />,
  },
  {
    path: AGENT_PROTECTED_ROUTES.PROFILE_SETTING,
    element: <ClientProfileSetting />,
  },
  {
    path: AGENT_PROTECTED_ROUTES.CHANGE_PASSWORD,
    element: <ClientChangePassword />,
  },
  { path: AGENT_PROTECTED_ROUTES.TWO_FA, element: <ClientTwoFASecurity /> },
  {
    path: AGENT_PROTECTED_ROUTES.NOTIFICATIONS,
    element: <ClientNotifications />,
  },
  { path: AGENT_PROTECTED_ROUTES.KYC, element: <ClientSharedKyc /> },
];

export const investorProtectedRoutesPaths = [
  {
    path: INVESTOR_PROTECTED_ROUTES.DASHBOARD,
    element: <ClientInvestorDashboard />,
  },
  {
    path: INVESTOR_PROTECTED_ROUTES.INVESTMENTS,
    element: <ClientInvestorInvestments />,
  },
  { path: INVESTOR_PROTECTED_ROUTES.KYC, element: <ClientSharedKyc /> },
  {
    path: INVESTOR_PROTECTED_ROUTES.ROI_HISTORY,
    element: <ClientInvestorRoiHistory />,
  },
  {
    path: INVESTOR_PROTECTED_ROUTES.TOP_UPS,
    element: <ClientInvestorTopUps />,
  },
  { path: INVESTOR_PROTECTED_ROUTES.WALLET, element: <ClientInvestorWallet /> },
  {
    path: INVESTOR_PROTECTED_ROUTES.WITHDRAWALS,
    element: <ClientInvestorWithdrawals />,
  },
  {
    path: INVESTOR_PROTECTED_ROUTES.PROFILE_SETTING,
    element: <ClientProfileSetting />,
  },
  {
    path: INVESTOR_PROTECTED_ROUTES.CHANGE_PASSWORD,
    element: <ClientChangePassword />,
  },
  { path: INVESTOR_PROTECTED_ROUTES.TWO_FA, element: <ClientTwoFASecurity /> },
  {
    path: INVESTOR_PROTECTED_ROUTES.NOTIFICATIONS,
    element: <ClientNotifications />,
  },
];
