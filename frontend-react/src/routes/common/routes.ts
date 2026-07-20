export const AUTH_ROUTES = {
  ADMINSIGNIN: "/admin",
  CLIENTSIGIN: "/",
};

export const PROTECTED_ROUTES = {
  ADMINDASHBOARD: "/admin/dashboard",
  ADMINPROFILE: "/admin/profile",
  ADMINPASSWORDCHANGE: "/admin/password",

  ADMINAGENTS: "/admin/agents",
  ADMINADDAGENT: "/admin/agents/add",
  ADMINAGENTPASSWORDRESET: "/admin/agents/password-reset",
  ADMINAGENTTREE: "/admin/agents/tree",
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

  // Nominee
  ADMINNOMINEEALL: "/admin/nominee",
  ADMINNOMINEEPENDING: "/admin/nominee/pending",
  ADMINNOMINEEAPPROVED: "/admin/nominee/approved",
  ADMINNOMINEEREJECTED: "/admin/nominee/rejected",
  ADMINNOMINEEDETAILS: "/admin/nominee/detail/:id",

  // ROI
  ADMINROILOG: "/admin/roi",

  // Commissions
  ADMINCOMMISSIONSLOG: "/admin/commissions",
  ADMINNOTIFICATIONS: "/admin/notifications",

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
  ASSIGN_USER: "/agent/assign-user",
  ALL_INVESTORS: "/agent/all-investors",
  TREE: "/agent/tree",
  COMMISSIONS: "/agent/commissions",
  TEAM: "/agent/team",
  WALLET: "/agent/wallet",
  WITHDRAWALS: "/agent/withdrawals",
  PROFILE_SETTING: "/agent/profile-setting",
  CHANGE_PASSWORD: "/agent/change-password",
  TWO_FA: "/agent/2fa-security",
  NOTIFICATIONS: "/agent/notifications",
  KYC: "/agent/kyc",
  NOMINEE: "/agent/nominee",
};

export const INVESTOR_PROTECTED_ROUTES = {
  DASHBOARD: "/investor/dashboard",
  INVESTMENTS: "/investor/investments",
  KYC: "/investor/kyc",
  ROI_HISTORY: "/investor/roi-history",
  WALLET: "/investor/wallet",
  WITHDRAWALS: "/investor/withdrawals",
  PROFILE_SETTING: "/investor/profile-setting",
  CHANGE_PASSWORD: "/investor/change-password",
  TWO_FA: "/investor/2fa-security",
  NOTIFICATIONS: "/investor/notifications",
  NOMINEE: "/investor/nominee",
};
