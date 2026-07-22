import { Schema, model, Document, Types } from 'mongoose';

export enum UserRole {
  AGENT = 'AGENT',
  SUB_AGENT = 'SUB_AGENT',
  INVESTOR = 'INVESTOR',
}

export enum KycStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  name: string;
  username: string;
  email: string;
  mobile?: string;
  password?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  role: UserRole;
  isActive: boolean;
  kycStatus: KycStatus;
  nomineeStatus: KycStatus;
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const baseOptions = {
  discriminatorKey: 'role', // our discriminator key
  collection: 'users',
  timestamps: true,
};

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true },
    country: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    isActive: { type: Boolean, default: true },
    kycStatus: {
      type: String,
      enum: Object.values(KycStatus),
      default: KycStatus.UNVERIFIED,
    },
    nomineeStatus: {
      type: String,
      enum: Object.values(KycStatus),
      default: KycStatus.UNVERIFIED,
    },
    walletBalance: { type: Number, default: 0 },
  },
  baseOptions
);

export const User = model<IUser>('User', userSchema);

// ==========================================
// Agent Discriminator
// ==========================================
export interface IAgent extends IUser {
  sponsor?: Types.ObjectId;
  level: number;
  downlineCount: number;
  commissionBalance: number;
}

const agentSchema = new Schema<IAgent>({
  sponsor: { type: Schema.Types.ObjectId, ref: 'User' },
  level: { type: Number, default: 1 },
  downlineCount: { type: Number, default: 0 },
  commissionBalance: { type: Number, default: 0 },
});

export const Agent = User.discriminator<IAgent>(UserRole.AGENT, agentSchema);

// ==========================================
// SubAgent Discriminator
// ==========================================
export interface ISubAgent extends IUser {
  sponsor?: Types.ObjectId;
  level: number;
  downlineCount: number;
  commissionBalance: number;
}

const subAgentSchema = new Schema<ISubAgent>({
  sponsor: { type: Schema.Types.ObjectId, ref: 'User' },
  level: { type: Number, default: 1 },
  downlineCount: { type: Number, default: 0 },
  commissionBalance: { type: Number, default: 0 },
});

export const SubAgent = User.discriminator<ISubAgent>(UserRole.SUB_AGENT, subAgentSchema);


// ==========================================
// Investor Discriminator
// ==========================================
export interface IInvestor extends IUser {
  referredBy?: Types.ObjectId;
  investmentBalance: number;
  roiBalance: number;
}

const investorSchema = new Schema<IInvestor>({
  referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
  investmentBalance: { type: Number, default: 0 },
  roiBalance: { type: Number, default: 0 },
});

export const Investor = User.discriminator<IInvestor>(UserRole.INVESTOR, investorSchema);
