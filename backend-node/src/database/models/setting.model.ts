import { Schema, model, Document } from 'mongoose';

export interface ISetting extends Document {
  roiCycleDays: number;
  minInvestmentAmount: number;
  commissionLevels: {
    level: number;
    percentage: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    roiCycleDays: { type: Number, required: true, default: 30 }, // Cycle length in days
    minInvestmentAmount: { type: Number, required: true, default: 100 },
    commissionLevels: [
      {
        level: { type: Number, required: true },
        percentage: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Setting = model<ISetting>('Setting', settingSchema);
