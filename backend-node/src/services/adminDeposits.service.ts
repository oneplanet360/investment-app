import { Deposit, DepositStatus } from '../database/models/deposit.model';
import { User } from '../database/models/user.model';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';
import mongoose from 'mongoose';

export const getDepositsService = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string
) => {
  const query: any = {};

  if (status && status !== 'all') {
    query.status = status.toUpperCase();
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

  const deposits = await Deposit.find(query)
    .populate('userId', 'name firstName lastName username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Deposit.countDocuments(query);

  return {
    data: deposits,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDepositDetailService = async (trxId: string) => {
  const deposit = await Deposit.findOne({ trxId }).populate(
    'userId',
    'name firstName lastName username email mobile country'
  );

  if (!deposit) {
    throw new customError('Deposit not found', HttpStatusCode.NOT_FOUND);
  }

  return deposit;
};

export const updateDepositStatusService = async (
  trxId: string,
  status: DepositStatus,
  adminRemarks?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deposit = await Deposit.findOne({ trxId })
      .populate('userId')
      .session(session);

    if (!deposit) {
      throw new customError('Deposit not found', HttpStatusCode.NOT_FOUND);
    }

    if (
      deposit.status === DepositStatus.SUCCESSFUL ||
      deposit.status === DepositStatus.REJECTED
    ) {
      throw new customError(
        `Cannot update a deposit that is already ${deposit.status}`,
        HttpStatusCode.BAD_REQUEST
      );
    }

    deposit.status = status;
    if (adminRemarks) {
      deposit.adminRemarks = adminRemarks;
    }

    if (status === DepositStatus.SUCCESSFUL) {
      await User.findByIdAndUpdate(
        deposit.userId,
        { $inc: { walletBalance: deposit.convertedAmount } },
        { session }
      );
    }

    await deposit.save({ session });
    await session.commitTransaction();
    session.endSession();
    return deposit;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
