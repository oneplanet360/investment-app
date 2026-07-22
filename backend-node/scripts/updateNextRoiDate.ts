import mongoose from 'mongoose';
import { Investment, InvestmentStatus } from '../src/database/models/investment.model';
import { Setting } from '../src/database/models/setting.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017/investment-app");
    console.log('Connected to DB');

    const setting = await Setting.findOne();
    const cycleDays = setting?.roiCycleDays || 1;

    console.log(`Using cycle days: ${cycleDays}`);

    const investments = await Investment.find({ status: InvestmentStatus.ACTIVE });
    console.log(`Found ${investments.length} active investments.`);

    let updatedCount = 0;
    for (const inv of investments) {
      if (inv.roiCycleStartDate) {
        const newNextRoi = new Date(inv.roiCycleStartDate);
        newNextRoi.setDate(newNextRoi.getDate() + cycleDays);
        inv.nextRoiDate = newNextRoi;
        await inv.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} investments.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
