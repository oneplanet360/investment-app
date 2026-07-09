export interface IAgent {
  _id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  username: string;
  email: string;
  mobile?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  isActive: boolean;
  kycStatus: string;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentPayload {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  mobile?: string;
  password?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  isActive?: boolean;
  referredBy?: string; // sponsor username
}

export interface AgentListResponse {
  data: IAgent[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
