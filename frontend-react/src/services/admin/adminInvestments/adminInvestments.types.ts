export interface IInvestment {
  _id: string;
  trxId: string;
  userId: {
    _id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    username: string;
    email: string;
    mobile?: string;
    country?: string;
  };
  amount: number;
  contributionAmount: number;
  contributionFrequency: string;
  totalReturn: number;
  type: string;
  status: string;
  roiCycleStartDate: string;
  nextRoiDate: string;
  createdAt: string;
  updatedAt: string;
  paymentProof?: string;
}

export interface IInvestmentResponse {
  success: boolean;
  message: string;
  data: IInvestment;
}

export interface IInvestmentListResponse {
  success: boolean;
  message: string;
  data: IInvestment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IUpdateInvestmentStatusPayload {
  status: string;
  adminRemarks?: string;
}
