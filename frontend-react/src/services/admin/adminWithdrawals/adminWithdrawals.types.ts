export interface IWithdrawal {
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
    role: string;
  };
  gateway: string;
  amount: number;
  charge: number;
  conversionRate: number;
  conversionCurrency: string;
  convertedAmount: number;
  type: string;
  status: string;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWithdrawalResponse {
  success: boolean;
  message: string;
  data: IWithdrawal;
}

export interface IWithdrawalListResponse {
  success: boolean;
  message: string;
  data: IWithdrawal[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IUpdateWithdrawalStatusPayload {
  status: string;
  adminRemarks?: string;
}
