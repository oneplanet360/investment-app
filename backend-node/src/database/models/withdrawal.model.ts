import { Schema, model, Document, Types } from 'mongoose';

export enum WithdrawalType {
  COMMISSION = 'COMMISSION',
  ROI_WALLET = 'ROI_WALLET', // Or just WALLET
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IWithdrawal extends Document {
  trxId: string;
  userId: Types.ObjectId; // Can be Agent or Investor (refers to User)
  amount: number;
  gateway: string;
  charge: number;
  conversionCurrency: string;
  conversionRate: number;
  convertedAmount: number;
  type: WithdrawalType;
  status: WithdrawalStatus;
  adminRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    trxId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    gateway: { type: String, required: true },
    charge: { type: Number, required: true, min: 0 },
    conversionCurrency: { type: String, required: true },
    conversionRate: { type: Number, required: true },
    convertedAmount: { type: Number, required: true },
    type: { type: String, enum: Object.values(WithdrawalType), required: true },
    status: {
      type: String,
      enum: Object.values(WithdrawalStatus),
      default: WithdrawalStatus.PENDING,
    },
    adminRemarks: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Withdrawal = model<IWithdrawal>('Withdrawal', withdrawalSchema);
