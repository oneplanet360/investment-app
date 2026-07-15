import { Schema, model, Document, Types } from 'mongoose';

export enum InvestmentType {
  INITIAL = 'INITIAL',
  TOP_UP = 'TOP_UP',
}

export enum InvestmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CLOSE_REQUEST = 'CLOSE_REQUEST',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export interface IInvestment extends Document {
  userId: Types.ObjectId;
  trxId: string;
  amount: number; // initial deposit
  contributionAmount: number;
  contributionFrequency: string;
  totalReturn: number;
  type: InvestmentType;
  status: InvestmentStatus;
  paymentProof?: string;
  roiCycleStartDate: Date;
  nextRoiDate: Date;
  roiLog?: { monthIndex: number };
  createdAt: Date;
  updatedAt: Date;
}

const investmentSchema = new Schema<IInvestment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trxId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    contributionAmount: { type: Number, default: 0 },
    contributionFrequency: { type: String, default: 'None' },
    totalReturn: { type: Number, default: 0 },
    type: { type: String, enum: Object.values(InvestmentType), required: true },
    status: {
      type: String,
      enum: Object.values(InvestmentStatus),
      default: InvestmentStatus.PENDING,
    },
    paymentProof: { type: String },
    roiCycleStartDate: { type: Date, required: true, default: Date.now },
    nextRoiDate: { type: Date, required: true },
    roiLog: {
      monthIndex: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const Investment = model<IInvestment>('Investment', investmentSchema);
