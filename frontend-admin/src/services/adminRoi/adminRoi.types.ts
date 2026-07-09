export interface AdminRoiRecord {
  id: string;
  _id: string;
  trxId: string;
  investorId: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
  };
  investmentId: {
    _id: string;
    trxId: string;
  };
  amount: number;
  roiRate: number;
  monthIndex: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRoiResponse {
  data: AdminRoiRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    stats?: {
      creditedCount: number;
      pendingCount: number;
      totalPaid: number;
    };
  };
}
