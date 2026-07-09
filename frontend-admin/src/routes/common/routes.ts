export const AUTH_ROUTES = {
  ADMINSIGNIN: '/',
};

export const PROTECTED_ROUTES = {
  ADMINDASHBOARD: '/dashboard',
  ADMINPROFILE: '/profile',
  ADMINPASSWORDCHANGE: '/password',

  // Agent Management — static routes before dynamic param
  ADMINAGENTS: '/agents',
  ADMINADDAGENT: '/agents/add',
  ADMINAGENTPASSWORDRESET: '/agents/password-reset',
  ADMINAGENTDETAILS: '/agents/:username',

  // Investor Management — static routes before dynamic param
  ADMININVESTORS: '/investors',
  ADMININVESTORPASSWORDRESET: '/investors/password-reset',
  ADMININVESTORDETAILS: '/investors/:username',

  ADMINSUBSCRIBERS: '/subscribers',
  ADMININVESTMENTREPORT: '/investment-report',

  // Investments
  ADMININVESTMENTSALL: '/investments',
  ADMININVESTMENTSACTIVE: '/investments/active',
  ADMININVESTMENTSCLOSED: '/investments/closed',
  ADMININVESTMENTSCOMPLETED: '/investments/completed',
  ADMININVESTMENTSCLOSEREQUESTS: '/investments/close-requests',
  ADMININVESTMENTSDETAILS: '/investments/detail/:trxId',

  // Deposits
  ADMINDEPOSITSALL: '/deposits',
  ADMINDEPOSITSPENDING: '/deposits/pending',
  ADMINDEPOSITSAPPROVED: '/deposits/approved',
  ADMINDEPOSITSSUCCESSFUL: '/deposits/successful',
  ADMINDEPOSITSREJECTED: '/deposits/rejected',
  ADMINDEPOSITSINITIATED: '/deposits/initiated',
  ADMINDEPOSITSDETAILS: '/deposits/detail/:trxId',

  // Withdrawals (Investor)
  ADMINWITHDRAWALSALL: '/withdrawals',
  ADMINWITHDRAWALSPENDING: '/withdrawals/pending',
  ADMINWITHDRAWALSAPPROVED: '/withdrawals/approved',
  ADMINWITHDRAWALSREJECTED: '/withdrawals/rejected',
  ADMINWITHDRAWALSDETAILS: '/withdrawals/detail/:trxId',

  // Agent Withdrawals
  ADMINAGENTWITHDRAWALS: '/withdrawals/agent',
  ADMINAGENTWITHDRAWALSDETAILS: '/withdrawals/agent/detail/:id',

  // KYC
  ADMINKYCALL: '/kyc',
  ADMINKYCPENDING: '/kyc/pending',
  ADMINKYCAPPROVED: '/kyc/approved',
  ADMINKYCREJECTED: '/kyc/rejected',
  ADMINKYCDETAILS: '/kyc/detail/:id',

  // Top-ups
  ADMINTOPUPSALL: '/topups',
  ADMINTOPUPSDETAILS: '/topups/detail/:trxId',

  // ROI
  ADMINROILOG: '/roi',
  ADMINROISETTINGS: '/roi/settings',

  // Commissions
  ADMINCOMMISSIONSLOG: '/commissions',
  ADMINCOMMISSIONSSETTINGS: '/commissions/settings',

  // System Settings
  ADMINSETTINGSINVESTMENT: '/settings/investment',
  ADMINSETTINGSADMIN: '/settings/admin',
  ADMINSETTINGSCLIENT: '/settings/client',

  // Reports
  ADMINREPORTINVESTMENTS: '/reports/investments',
  ADMINREPORTROI: '/reports/roi',
  ADMINREPORTCOMMISSIONS: '/reports/commissions',
  ADMINREPORTWITHDRAWALS: '/reports/withdrawals',
};