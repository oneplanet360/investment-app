import { Schema, model, Document, Types } from 'mongoose';

export enum InvestmentType {
  INITIAL = 'INITIAL',
  TOP_UP = 'TOP_UP',
}

export enum InvestmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED', // When it finishes or is withdrawn, depending on logic
}

export interface IInvestment extends Document {
  userId: Types.ObjectId;
  amount: number;
  type: InvestmentType;
  status: InvestmentStatus;
  roiCycleStartDate: Date;
  nextRoiDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const investmentSchema = new Schema<IInvestment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: Object.values(InvestmentType), required: true },
    status: {
      type: String,
      enum: Object.values(InvestmentStatus),
      default: InvestmentStatus.ACTIVE,
    },
    roiCycleStartDate: { type: Date, required: true, default: Date.now },
    nextRoiDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Investment = model<IInvestment>('Investment', investmentSchema);
