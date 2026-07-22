export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    stats?: Record<string, unknown>;
  };
}

export type UserRole = "AGENT" | "INVESTOR";

export type KycStatus = "UNVERIFIED" | "PENDING" | "APPROVED" | "REJECTED";

export interface IUser {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  mobile?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  role: UserRole;
  isActive: boolean;
  kycStatus: KycStatus;
  walletBalance: number;
  emailVerified?: boolean;
  mobileVerified?: boolean;
  twoFa?: boolean;
  level?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAgent extends IUser {
  sponsor?: string | IUser;
  level: number;
  downlineCount: number;
  commissionBalance: number;
}

export interface IInvestor extends IUser {
  referredBy?: string | IUser;
  investmentBalance: number;
  roiBalance: number;
}

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
}

export interface ISetting {
  _id: string;
  monthlyRoiPercentage: number;
  minInvestmentAmount: number;
  commissionLevels: {
    level: number;
    percentage: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface IAdminSetting {
  _id: string;
  appName: string;
  sidebarColor: string;
  backgroundColor: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export type InvestmentType = "INITIAL" | "TOP_UP";

export type InvestmentStatus =
  "PENDING" | "ACTIVE" | "COMPLETED" | "CLOSE_REQUEST" | "CLOSED" | "REJECTED";

export interface IInvestment {
  _id: string;
  userId: string | IUser;
  trxId: string;
  amount: number;
  contributionAmount: number;
  contributionFrequency: string;
  totalReturn: number;
  type: InvestmentType;
  status: InvestmentStatus;
  roiCycleStartDate: string;
  nextRoiDate: string;
  createdAt: string;
  updatedAt: string;
  paymentProof?: string;
}

export type WithdrawalType = "COMMISSION" | "ROI_WALLET";

export type WithdrawalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IWithdrawal {
  _id: string;
  trxId: string;
  userId: string | IUser;
  amount: number;
  gateway: string;
  charge: number;
  conversionCurrency: string;
  conversionRate: number;
  convertedAmount: number;
  type: WithdrawalType;
  status: WithdrawalStatus;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommissionStatus = "PENDING" | "PAID";

export interface ICommission {
  _id: string;
  trxId: string;
  agentId: string | IUser;
  investorId: string | IUser;
  investmentId: string | IInvestment;
  level: number;
  rate: number;
  amount: number;
  status: CommissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IDeposit {
  _id: string;
  trxId: string;
  userId: string | IUser;
  amount: number;
  gateway: string;
  status: string;
  createdAt: string;
}

export interface IKyc {
  _id: string;
  userId: string | IUser;
  documentType: string;
  documentNumber: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  status: KycStatus;
  adminRemarks?: string;
  createdAt: string;
}

export interface INominee {
  _id: string;
  userId: string | IUser;
  nomineeName: string;
  relation: string;
  documentType: string;
  documentNumber: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  status: KycStatus;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
}
