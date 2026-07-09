import { User } from '../database/models/user.model';
import { Investment } from '../database/models/investment.model';
import { Deposit } from '../database/models/deposit.model';
import { Withdrawal } from '../database/models/withdrawal.model';

export const getAdminUserDetailService = async (username: string, expectedRole: string) => {
  const user = await User.findOne({ username, role: expectedRole }).select('-password -__v');
  if (!user) {
    return null;
  }

  const userId = user._id;

  const invStats = await Investment.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        completedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
        },
        closeRequests: {
          $sum: { $cond: [{ $eq: ['$status', 'CLOSE_REQUEST'] }, 1, 0] }
        },
        totalContribution: { $sum: '$contributionAmount' } // Assuming this is requested metric
      }
    }
  ]);

  const depStats = await Deposit.aggregate([
    { $match: { userId, status: 'APPROVED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const wdStats = await Withdrawal.aggregate([
    { $match: { userId, status: 'APPROVED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  // transactions count could be sum of all docs
  const depositsCount = await Deposit.countDocuments({ userId });
  const wdCount = await Withdrawal.countDocuments({ userId });
  const invCount = await Investment.countDocuments({ userId });

  const stats = invStats[0] || {};

  return {
    user,
    stats: {
      balance: user.walletBalance || 0,
      totalInvestments: stats.count || 0,
      totalContribution: stats.totalContribution || 0,
      closeRequests: stats.closeRequests || 0,
      completedInvestments: stats.completedCount || 0,
      deposits: depStats[0]?.total || 0,
      withdrawals: wdStats[0]?.total || 0,
      transactions: depositsCount + wdCount + invCount
    }
  };
};
