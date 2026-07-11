export interface IKycUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  country?: string;
  address?: string;
}

export interface IKyc {
  _id: string;
  userId: IKycUser;
  documentType: string;
  documentNumber?: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  status: "UNVERIFIED" | "PENDING" | "APPROVED" | "REJECTED";
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KycListResponse {
  data: IKyc[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
