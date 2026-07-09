export interface AdminCommissionRecord {
  id: string;
  _id: string;
  trxId: string;
  agentId: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
  investorId: {
    _id: string;
    username: string;
  };
  investmentId: {
    _id: string;
    trxId: string;
  };
  level: number;
  rate: number;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCommissionResponse {
  data: AdminCommissionRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    stats?: {
      totalPaid: number;
      levelTotals: Record<number, number>;
    };
  };
}
