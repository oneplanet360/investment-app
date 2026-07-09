import {
  Withdrawal,
  WithdrawalStatus,
  WithdrawalType,
} from '../database/models/withdrawal.model';
import { User, UserRole } from '../database/models/user.model';
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
  const withdrawal = await Withdrawal.findOne({ trxId }).populate('userId');

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
    // Refund the amount to the user's wallet
    const user: any = withdrawal.userId;
    user.walletBalance = (user.walletBalance || 0) + withdrawal.amount;
    await user.save();
  }

  withdrawal.status = status;
  if (adminRemarks) {
    withdrawal.adminRemarks = adminRemarks;
  }

  await withdrawal.save();
  return withdrawal;
};
