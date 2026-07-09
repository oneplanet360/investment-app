export interface IUserDetailStats {
  balance: number;
  totalInvestments: number;
  totalContribution: number;
  closeRequests: number;
  completedInvestments: number;
  deposits: number;
  withdrawals: number;
  transactions: number;
}

export interface IUserDetailResponse {
  user: any; // We can use exact IAgent or IInvestor later
  stats: IUserDetailStats;
}
