import { Schema, model, Document } from 'mongoose';

export interface ISetting extends Document {
  monthlyRoiPercentage: number;
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
    monthlyRoiPercentage: { type: Number, required: true, default: 5 }, // e.g. 5 to 7%
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
