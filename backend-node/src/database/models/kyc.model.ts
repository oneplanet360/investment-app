import { Schema, model, Document, Types } from 'mongoose';
import { KycStatus } from './user.model';

export interface IKyc extends Document {
  userId: Types.ObjectId;
  documentType: string;
  documentNumber?: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  status: KycStatus;
  adminRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const kycSchema = new Schema<IKyc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    documentType: { type: String, required: true },
    documentNumber: { type: String },
    documentFrontUrl: { type: String, required: true },
    documentBackUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(KycStatus),
      default: KycStatus.PENDING,
    },
    adminRemarks: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Kyc = model<IKyc>('Kyc', kycSchema);
