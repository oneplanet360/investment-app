import { Schema, model, Document, Types } from 'mongoose';

export enum UserRole {
  AGENT = 'AGENT',
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
  referredBy?: Types.ObjectId; // Reference to Agent for Investors, or Sponsor for Agent
  isActive: boolean;
  kycStatus: KycStatus;
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

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
    role: { type: String, enum: Object.values(UserRole), required: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    kycStatus: {
      type: String,
      enum: Object.values(KycStatus),
      default: KycStatus.UNVERIFIED,
    },
    walletBalance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', userSchema);
