export interface InvestmentReportStats {
  totalInvested: number;
  totalProjectedReturn: number;
  totalRoiPaid: number;
  totalCommissions: number;
  totalTopUps: number;
  totalInvestments: number;
  byStatus: {
    active: number;
    completed: number;
    closed: number;
  };
  topInvestors: [string, number][];
  commissionDistribution: Record<number, { amount: number; count: number }>;
}

export interface RoiReportStats {
  totalPaid: number;
  totalCredits: number;
  avgRate: string;
  uniqueInvestors: number;
  byMonth: [string, { count: number; total: number }][];
}

export interface WithdrawalReportStats {
  investor: {
    approved: { total: number; count: number };
    pending: { total: number; count: number };
    rejected: { total: number; count: number };
  };
  agent: {
    approved: { total: number; count: number };
    pending: { total: number; count: number };
    rejected: { total: number; count: number };
  };
}

export interface CommissionReportStats {
  totalPaid: number;
  levelDistribution: Record<number, number>;
  topEarningAgents: [string, { name: string; total: number; count: number }][];
}
