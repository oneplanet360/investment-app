import { Schema, model, Document, Types } from 'mongoose';
import { KycStatus } from './user.model';

export interface INominee extends Document {
  userId: Types.ObjectId;
  nomineeName: string;
  relation: string;
  documentType: string;
  documentNumber?: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  status: KycStatus;
  adminRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const nomineeSchema = new Schema<INominee>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nomineeName: { type: String, required: true },
    relation: { type: String, required: true },
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

export const Nominee = model<INominee>('Nominee', nomineeSchema);
