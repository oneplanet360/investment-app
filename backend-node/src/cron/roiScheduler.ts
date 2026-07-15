import cron from 'node-cron';
import mongoose from 'mongoose';
import {
  Investment,
  InvestmentStatus,
} from '../database/models/investment.model';
import { Investor } from '../database/models/user.model';
import { Roi } from '../database/models/roi.model';
import { Setting } from '../database/models/setting.model';
import { customLogger, generateTransactionId } from '../utils';
import { distributeCommissionService } from '../services/clientInvestments.service';

export const startRoiScheduler = () => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    customLogger.info('Starting daily ROI processing...');

    try {
      const now = new Date();

      // Find all investments where nextRoiDate has passed and are active
      const dueInvestments = await Investment.find({
        status: InvestmentStatus.ACTIVE,
        nextRoiDate: { $lte: now },
      });

      if (dueInvestments.length === 0) {
        customLogger.info('No investments due for ROI today.');
        return;
      }

      customLogger.info(
        `Found ${dueInvestments.length} investments due for ROI.`
      );

      const settings = await Setting.findOne();
      const roiPercentage = settings?.monthlyRoiPercentage || 0; // Default to 0 if not set

      if (roiPercentage <= 0) {
        customLogger.warn(
          'ROI percentage is 0 or not set. Skipping ROI payouts.'
        );
        return;
      }

      for (const investment of dueInvestments) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const roiAmount = (investment.amount * roiPercentage) / 100;

          // Credit investor
          await Investor.findByIdAndUpdate(
            investment.userId,
            { $inc: { roiBalance: roiAmount, walletBalance: roiAmount } },
            { session }
          );

          // Update investment
          const nextRoiDate = new Date(investment.nextRoiDate);
          nextRoiDate.setMonth(nextRoiDate.getMonth() + 1);

          await Investment.findByIdAndUpdate(
            investment._id,
            {
              $set: { nextRoiDate },
              $inc: { 'roiLog.monthIndex': 1 },
            },
            { session }
          );

          // Create ROI log
          await Roi.create(
            [
              {
                trxId: generateTransactionId(),
                investorId: investment.userId,
                investmentId: investment._id,
                amount: roiAmount,
                roiRate: roiPercentage,
                monthIndex: investment.roiLog?.monthIndex
                  ? investment.roiLog.monthIndex + 1
                  : 1,
              },
            ],
            { session }
          );

          // Distribute commissions based on the ROI amount
          await distributeCommissionService(
            investment.userId as mongoose.Types.ObjectId,
            investment._id as mongoose.Types.ObjectId,
            roiAmount,
            session
          );

          await session.commitTransaction();
          session.endSession();

          customLogger.info(`Processed ROI for investment ${investment._id}`);
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          customLogger.error(
            `Failed to process ROI for investment ${investment._id}`,
            error
          );
        }
      }

      customLogger.info('Daily ROI processing completed.');
    } catch (error) {
      customLogger.error('Error in daily ROI scheduler', error);
    }
  });

  customLogger.info('ROI Scheduler initialized.');
};
