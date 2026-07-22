import {
  Withdrawal,
  WithdrawalStatus,
  WithdrawalType,
} from '../database/models/withdrawal.model';
import { User, UserRole, Agent } from '../database/models/user.model';
import mongoose from 'mongoose';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';

export const getWithdrawalsService = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string,
  type?: string
) => {
  const query: any = {};

  if (status && status !== 'all') {
    query.status = status.toUpperCase();
  }

  if (type) {
    query.type = type;
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

  const withdrawals = await Withdrawal.find(query)
    .populate('userId', 'name firstName lastName username email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Withdrawal.countDocuments(query);

  return {
    data: withdrawals,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getWithdrawalDetailService = async (trxId: string) => {
  const withdrawal = await Withdrawal.findOne({ trxId }).populate(
    'userId',
    'name firstName lastName username email mobile country role'
  );

  if (!withdrawal) {
    throw new customError('Withdrawal not found', HttpStatusCode.NOT_FOUND);
  }

  return withdrawal;
};

export const updateWithdrawalStatusService = async (
  trxId: string,
  status: WithdrawalStatus,
  adminRemarks?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const withdrawal = await Withdrawal.findOne({ trxId }).populate('userId').session(session);

    if (!withdrawal) {
      throw new customError('Withdrawal not found', HttpStatusCode.NOT_FOUND);
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new customError(
        'Can only update pending withdrawals',
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (status === WithdrawalStatus.REJECTED) {
      if (withdrawal.type === WithdrawalType.COMMISSION) {
        await User.findByIdAndUpdate(
          withdrawal.userId,
          { $inc: { commissionBalance: withdrawal.amount } },
          { session }
        );
      } else {
        await User.findByIdAndUpdate(
          withdrawal.userId,
          { $inc: { walletBalance: withdrawal.amount } },
          { session }
        );
      }
    }

    withdrawal.status = status;
    if (adminRemarks) {
      withdrawal.adminRemarks = adminRemarks;
    }

    await withdrawal.save({ session });
    await session.commitTransaction();
    session.endSession();
    return withdrawal;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
