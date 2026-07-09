export interface IDeposit {
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
  gateway: string;
  amount: number;
  charge: number;
  conversionRate: number;
  conversionCurrency: string;
  convertedAmount: number;
  status: string;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDepositResponse {
  success: boolean;
  message: string;
  data: IDeposit;
}

export interface IDepositListResponse {
  success: boolean;
  message: string;
  data: IDeposit[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IUpdateDepositStatusPayload {
  status: string;
  adminRemarks?: string;
}
