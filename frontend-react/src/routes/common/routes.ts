export const AUTH_ROUTES = {
  ADMINSIGNIN: "/admin/signin",
  CLIENTSIGIN: "/",
};

export const PROTECTED_ROUTES = {
  ADMINDASHBOARD: "/admin/dashboard",
  ADMINPROFILE: "/admin/profile",
  ADMINPASSWORDCHANGE: "/admin/password",

  ADMINAGENTS: "/admin/agents",
  ADMINADDAGENT: "/admin/agents/add",
  ADMINAGENTPASSWORDRESET: "/admin/agents/password-reset",
  ADMINAGENTDETAILS: "/admin/agents/:username",

  ADMININVESTORS: "/admin/investors",
  ADMININVESTORPASSWORDRESET: "/admin/investors/password-reset",
  ADMININVESTORDETAILS: "/admin/investors/:username",

  ADMINSUBSCRIBERS: "/admin/subscribers",
  ADMININVESTMENTREPORT: "/admin/investment-report",

  // Investments
  ADMININVESTMENTSALL: "/admin/investments",
  ADMININVESTMENTSACTIVE: "/admin/investments/active",
  ADMININVESTMENTSCLOSED: "/admin/investments/closed",
  ADMININVESTMENTSCOMPLETED: "/admin/investments/completed",
  ADMININVESTMENTSCLOSEREQUESTS: "/admin/investments/close-requests",
  ADMININVESTMENTSDETAILS: "/admin/investments/detail/:trxId",

  // Deposits
  ADMINDEPOSITSALL: "/admin/deposits",
  ADMINDEPOSITSPENDING: "/admin/deposits/pending",
  ADMINDEPOSITSAPPROVED: "/admin/deposits/approved",
  ADMINDEPOSITSSUCCESSFUL: "/admin/deposits/successful",
  ADMINDEPOSITSREJECTED: "/admin/deposits/rejected",
  ADMINDEPOSITSINITIATED: "/admin/deposits/initiated",
  ADMINDEPOSITSDETAILS: "/admin/deposits/detail/:trxId",

  // Withdrawals (Investor)
  ADMINWITHDRAWALSALL: "/admin/withdrawals",
  ADMINWITHDRAWALSPENDING: "/admin/withdrawals/pending",
  ADMINWITHDRAWALSAPPROVED: "/admin/withdrawals/approved",
  ADMINWITHDRAWALSREJECTED: "/admin/withdrawals/rejected",
  ADMINWITHDRAWALSDETAILS: "/admin/withdrawals/detail/:trxId",

  // Agent Withdrawals
  ADMINAGENTWITHDRAWALS: "/admin/withdrawals/agent",
  ADMINAGENTWITHDRAWALSDETAILS: "/admin/withdrawals/agent/detail/:id",

  // KYC
  ADMINKYCALL: "/admin/kyc",
  ADMINKYCPENDING: "/admin/kyc/pending",
  ADMINKYCAPPROVED: "/admin/kyc/approved",
  ADMINKYCREJECTED: "/admin/kyc/rejected",
  ADMINKYCDETAILS: "/admin/kyc/detail/:id",

  // Top-ups
  ADMINTOPUPSALL: "/admin/topups",
  ADMINTOPUPSDETAILS: "/admin/topups/detail/:trxId",

  // ROI
  ADMINROILOG: "/admin/roi",

  // Commissions
  ADMINCOMMISSIONSLOG: "/admin/commissions",

  // System Settings
  ADMINSETTINGSINVESTMENT: "/admin/settings/investment",
  ADMINSETTINGSADMIN: "/admin/settings/admin",
  ADMINSETTINGSCLIENT: "/admin/settings/client",

  // Reports
  ADMINREPORTINVESTMENTS: "/admin/reports/investments",
  ADMINREPORTROI: "/admin/reports/roi",
  ADMINREPORTCOMMISSIONS: "/admin/reports/commissions",
  ADMINREPORTWITHDRAWALS: "/admin/reports/withdrawals",
};

export const AGENT_PROTECTED_ROUTES = {
  DASHBOARD: "/agent/dashboard",
  ADD_INVESTOR: "/agent/add-investor",
  ALL_INVESTORS: "/agent/all-investors",
  COMMISSIONS: "/agent/commissions",
  TEAM: "/agent/team",
  WALLET: "/agent/wallet",
  WITHDRAWALS: "/agent/withdrawals",
};

export const INVESTOR_PROTECTED_ROUTES = {
  DASHBOARD: "/investor/dashboard",
  INVESTMENTS: "/investor/investments",
  KYC: "/investor/kyc",
  ROI_HISTORY: "/investor/roi-history",
  TOP_UPS: "/investor/top-ups",
  WALLET: "/investor/wallet",
  WITHDRAWALS: "/investor/withdrawals",
};
