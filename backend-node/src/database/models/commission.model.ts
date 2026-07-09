import { Schema, model, Document, Types } from 'mongoose';

export enum CommissionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface ICommission extends Document {
  trxId: string;
  agentId: Types.ObjectId;
  investorId: Types.ObjectId;
  investmentId: Types.ObjectId;
  level: number;
  rate: number;
  amount: number;
  status: CommissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const commissionSchema = new Schema<ICommission>(
  {
    trxId: { type: String, required: true, unique: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    investmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Investment',
      required: true,
    },
    level: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(CommissionStatus),
      default: CommissionStatus.PAID, // Paid immediately to wallet usually, but can be pending
    },
  },
  {
    timestamps: true,
  }
);

export const Commission = model<ICommission>('Commission', commissionSchema);
