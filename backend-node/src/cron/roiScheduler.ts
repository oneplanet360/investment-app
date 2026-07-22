import cron from 'node-cron';
import mongoose from 'mongoose';
import { Investment, InvestmentStatus } from '../database/models/investment.model';
import { Investor } from '../database/models/user.model';
import { Roi, RoiStatus } from '../database/models/roi.model';
import { Setting } from '../database/models/setting.model';
import { customLogger, generateTransactionId } from '../utils';
import { distributeCommissionService } from '../services/clientInvestments.service';

export const startRoiScheduler = () => {
  // Run daily at midnight
  cron.schedule('* * * * *', async () => {
    customLogger.info('Starting daily ROI processing...');

    try {
      const now = new Date();
      
      // Find all investments where nextRoiDate has passed and are active
      const dueInvestments = await Investment.find({
        status: InvestmentStatus.ACTIVE,
        nextRoiDate: { $lte: now }
      });

      if (dueInvestments.length === 0) {
        customLogger.info('No investments due for ROI today.');
        return;
      }

      customLogger.info(`Found ${dueInvestments.length} investments due for ROI.`);

      const settings = await Setting.findOne();
      const cycleDays = settings?.roiCycleDays || 30;

      if (cycleDays <= 0) {
        customLogger.warn('ROI cycle days is invalid. Skipping ROI generation.');
        return;
      }

      for (const investment of dueInvestments) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {

          
          // We no longer automatically credit the investor or distribute commissions here.
          // This is now handled upon manual approval of the ROI request.          // Update investment
          const nextRoiDate = new Date(investment.nextRoiDate);
          nextRoiDate.setDate(nextRoiDate.getDate() + cycleDays);

          await Investment.findByIdAndUpdate(
            investment._id,
            {
              $set: { nextRoiDate },
              $inc: { 'roiLog.monthIndex': 1 }
            },
            { session }
          );

          // Create ROI log
          await Roi.create([{
            trxId: generateTransactionId(),
            investorId: investment.userId,
            investmentId: investment._id,
            amount: 0,
            roiRate: 0,
            monthIndex: investment.roiLog?.monthIndex ? investment.roiLog.monthIndex + 1 : 1,
            status: RoiStatus.PENDING
          }], { session });

          await session.commitTransaction();
          session.endSession();
          
          customLogger.info(`Processed ROI for investment ${investment._id}`);
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          customLogger.error(`Failed to process ROI for investment ${investment._id}`, error);
        }
      }
      
      customLogger.info('Daily ROI processing completed.');
    } catch (error) {
      customLogger.error('Error in daily ROI scheduler', error);
    }
  });
  
  customLogger.info('ROI Scheduler initialized.');
};
