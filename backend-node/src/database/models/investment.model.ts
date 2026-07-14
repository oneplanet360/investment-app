import { Schema, model, Document, Types } from 'mongoose';

export enum InvestmentType {
  INITIAL = 'INITIAL',
  TOP_UP = 'TOP_UP',
}

export enum InvestmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED', // When it finishes or is withdrawn, depending on logic
  CLOSE_REQUEST = 'CLOSE_REQUEST',
  CLOSED = 'CLOSED',
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
      default: InvestmentStatus.ACTIVE,
    },
    roiCycleStartDate: { type: Date, required: true, default: Date.now },
    nextRoiDate: { type: Date, required: true },
    roiLog: {
      monthIndex: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
  }
);

export const Investment = model<IInvestment>('Investment', investmentSchema);
