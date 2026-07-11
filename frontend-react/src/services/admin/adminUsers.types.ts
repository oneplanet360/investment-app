import type { IAgent, IInvestor } from "../../types";

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
  user: IAgent | IInvestor;
  stats: IUserDetailStats;
}
