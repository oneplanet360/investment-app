export const AUTH_ROUTES = {
  ADMINSIGNIN: '/',
};

export const PROTECTED_ROUTES = {
  ADMINDASHBOARD: '/dashboard',
  ADMINPROFILE: '/profile',
  ADMINPASSWORDCHANGE: '/password',
  ADMINAGENTS: '/agents',
  ADMININVESTORS: '/investors',
  ADMINADDAGENT: '/agents/add',
  ADMINAGENTDETAILS: '/agents/:username',
  ADMININVESTORDETAILS: '/investors/:username',
  ADMINAGENTPASSWORDRESET: '/agents/password-reset',
  ADMININVESTORPASSWORDRESET: '/investors/password-reset',
  ADMINSUBSCRIBERS: '/subscribers',
  ADMININVESTMENTREPORT: '/investment-report',
  ADMINDEPOSITSALL: '/deposits',
  ADMINDEPOSITSPENDING: '/deposits/pending',
  ADMINDEPOSITSAPPROVED: '/deposits/approved',
  ADMINDEPOSITSSUCCESSFUL: '/deposits/successful',
  ADMINDEPOSITSREJECTED: '/deposits/rejected',
  ADMINDEPOSITSINITIATED: '/deposits/initiated',
  ADMINDEPOSITSDETAILS: '/deposits/detail/:trxId',
  ADMINWITHDRAWALSALL: '/withdrawals',
  ADMINWITHDRAWALSPENDING: '/withdrawals/pending',
  ADMINWITHDRAWALSAPPROVED: '/withdrawals/approved',
  ADMINWITHDRAWALSREJECTED: '/withdrawals/rejected',
  ADMINWITHDRAWALSDETAILS: '/withdrawals/detail/:trxId'
};