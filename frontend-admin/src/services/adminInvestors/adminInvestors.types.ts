export interface IInvestor {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  mobile: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  role: 'INVESTOR';
  kycStatus: 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface InvestorListResponse {
  data: IInvestor[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ResetInvestorPasswordPayload {
  investorId: string;
  newPassword?: string;
}
