import { Schema, model, Document, Types } from 'mongoose';

export enum RoiStatus {
  CREDITED = 'CREDITED',
}

export interface IRoi extends Document {
  investorId: Types.ObjectId;
  investmentId: Types.ObjectId;
  amount: number;
  monthIndex: number; // e.g., 1st month, 2nd month...
  status: RoiStatus;
  createdAt: Date;
  updatedAt: Date;
}

const roiSchema = new Schema<IRoi>(
  {
    investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    investmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Investment',
      required: true,
    },
    amount: { type: Number, required: true },
    monthIndex: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(RoiStatus),
      default: RoiStatus.CREDITED,
    },
  },
  {
    timestamps: true,
  }
);

export const Roi = model<IRoi>('Roi', roiSchema);
