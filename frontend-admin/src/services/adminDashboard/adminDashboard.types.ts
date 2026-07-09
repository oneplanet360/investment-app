export interface IDashboardStats {
  totalMembers: number;
  activeMembers: number;
  newRegistrations: number;
  totalBusiness: number;
  totalIncomePaid: number;
  totalDeposited: number;
  pendingDeposits: number;
  rejectedDeposits: number;
  depositedCharge: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  rejectedWithdrawals: number;
  withdrawalCharge: number;
}

export interface IRecentTransaction {
  id: string;
  user: string;
  username: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit';
  amount: number;
  status: 'completed' | 'pending' | 'rejected';
  date: string;
}

export interface IDashboardData {
  stats: IDashboardStats;
  recentTransactions: IRecentTransaction[];
}
