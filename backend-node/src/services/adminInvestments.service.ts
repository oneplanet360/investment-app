import {
  Investment,
  InvestmentStatus,
} from '../database/models/investment.model';
import { User } from '../database/models/user.model';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';

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
  const investment = await Investment.findOne({ trxId }).populate('userId');

  if (!investment) {
    throw new customError('Investment not found', HttpStatusCode.NOT_FOUND);
  }

  // Handle closure requests specifically
  if (status === InvestmentStatus.CLOSED) {
    if (investment.status === InvestmentStatus.CLOSED) {
      throw new customError(
        'Investment is already closed',
        HttpStatusCode.BAD_REQUEST
      );
    }

    const user: any = investment.userId;
    // Payout the initial deposit plus total return (example logic)
    const payoutAmount = investment.amount + investment.totalReturn;
    user.walletBalance = (user.walletBalance || 0) + payoutAmount;
    await user.save();
  }

  investment.status = status;
  // Investment model might not have adminRemarks currently, but usually it does. We won't set it if it doesn't exist on schema.

  await investment.save();
  return investment;
};
