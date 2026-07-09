import { Schema, model, Document, Types } from 'mongoose';

export enum DepositStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SUCCESSFUL = 'SUCCESSFUL',
  REJECTED = 'REJECTED',
}

export interface IDeposit extends Document {
  userId: Types.ObjectId;
  trxId: string;
  gateway: string;
  amount: number;
  charge: number;
  conversionRate: number;
  conversionCurrency: string;
  convertedAmount: number;
  status: DepositStatus;
  adminRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const depositSchema = new Schema<IDeposit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trxId: { type: String, required: true, unique: true },
    gateway: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    charge: { type: Number, required: true, min: 0, default: 0 },
    conversionRate: { type: Number, required: true, default: 1 },
    conversionCurrency: { type: String, required: true, default: 'USD' },
    convertedAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(DepositStatus),
      default: DepositStatus.INITIATED,
    },
    adminRemarks: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Deposit = model<IDeposit>('Deposit', depositSchema);
