import {
  Investment,
  InvestmentStatus,
} from '../database/models/investment.model';
import { User } from '../database/models/user.model';
import { Setting } from '../database/models/setting.model';
import { Roi, RoiStatus } from '../database/models/roi.model';
import { customError, generateTransactionId } from '../utils';
import { HttpStatusCode } from '../constants';
import mongoose from 'mongoose';

export const getInvestmentsService = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string
) => {
  const query: any = {};

  if (status && status !== 'all') {
    if (status === 'close-requests') {
      query.status = InvestmentStatus.CLOSE_REQUEST;
    } else {
      query.status = status.toUpperCase();
    }
  }

  if (search) {
    const regex = new RegExp(search, 'i');
    const matchingUsers = await User.find({
      $or: [{ username: regex }, { name: regex }],
    }).select('_id');
    const userIds = matchingUsers.map((u) => u._id);

    query.$or = [{ trxId: regex }, { userId: { $in: userIds } }];
  }

  const skip = (page - 1) * limit;

  const investments = await Investment.find(query)
    .populate('userId', 'name firstName lastName username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Investment.countDocuments(query);

  return {
    data: investments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getInvestmentDetailService = async (trxId: string) => {
  const investment = await Investment.findOne({ trxId }).populate(
    'userId',
    'name firstName lastName username email mobile country'
  );

  if (!investment) {
    throw new customError('Investment not found', HttpStatusCode.NOT_FOUND);
  }

  return investment;
};

export const updateInvestmentStatusService = async (
  trxId: string,
  status: InvestmentStatus,
  adminRemarks?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const investment = await Investment.findOne({ trxId }).session(session);

    if (!investment) {
      throw new customError('Investment not found', HttpStatusCode.NOT_FOUND);
    }

    if (investment.status === status) {
      throw new customError(`Investment is already ${status}`, HttpStatusCode.BAD_REQUEST);
    }

    const user = await User.findById(investment.userId).session(session) as any;

    // Handle approval logic (PENDING -> ACTIVE)
    if (status === InvestmentStatus.ACTIVE && investment.status === InvestmentStatus.PENDING) {
      user.investmentBalance = (user.investmentBalance || 0) + investment.amount;
      await user.save({ session });
    }

    // Handle closure requests specifically
    if (status === InvestmentStatus.CLOSED) {
      if (investment.status === InvestmentStatus.CLOSED) {
        throw new customError(
          'Investment is already closed',
          HttpStatusCode.BAD_REQUEST
        );
      }

      // Decrement active investment balance if closing an active one
      if (investment.status === InvestmentStatus.ACTIVE || investment.status === InvestmentStatus.CLOSE_REQUEST) {
         user.investmentBalance = Math.max((user.investmentBalance || 0) - investment.amount, 0);
      }
      
      // Payout the initial deposit
      const payoutAmount = investment.amount;
      user.walletBalance = (user.walletBalance || 0) + payoutAmount;

      // Calculate and payout pro-rated ROI
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysPassed = Math.floor((Date.now() - investment.roiCycleStartDate.getTime()) / msPerDay);
      
      if (daysPassed > 0) {
        // Generate a pending ROI log for the admin to manually approve an amount for this partial cycle
        await Roi.create([{
          trxId: generateTransactionId(),
          investorId: investment.userId,
          investmentId: investment._id,
          amount: 0,
          roiRate: 0,
          monthIndex: investment.roiLog?.monthIndex ? investment.roiLog.monthIndex + 1 : 1,
          status: RoiStatus.PENDING
        }], { session });
      }

      await user.save({ session });
    }

    investment.status = status;
    await investment.save({ session });

    await session.commitTransaction();
    session.endSession();
    return investment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
