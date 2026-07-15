import { User } from '../database/models/user.model';
import { Investment } from '../database/models/investment.model';
import { Deposit } from '../database/models/deposit.model';
import { Withdrawal } from '../database/models/withdrawal.model';
import jwt from 'jsonwebtoken';
import { ParsedEnvVariables } from '../configs';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';

import { Notification } from '../database/models/notification.model';

export const toggleUserBanService = async (
  username: string,
  expectedRole: string
) => {
  const user = await User.findOne({ username, role: expectedRole });
  if (!user) {
    throw new customError('User not found', HttpStatusCode.NOT_FOUND);
  }
  user.isActive = !user.isActive;
  await user.save();
  return user;
};

export const sendNotificationService = async (
  username: string,
  expectedRole: string,
  title: string,
  message: string
) => {
  const user = await User.findOne({ username, role: expectedRole });
  if (!user) {
    throw new customError('User not found', HttpStatusCode.NOT_FOUND);
  }
  const notification = await Notification.create({
    userId: user._id,
    title,
    message,
  });
  return notification;
};

export const impersonateUserService = async (
  username: string,
  expectedRole: string
) => {
  const user = await User.findOne({ username, role: expectedRole });
  if (!user) {
    throw new customError('User not found', HttpStatusCode.NOT_FOUND);
  }

  const token = await jwt.sign(
    { _id: user._id, role: user.role },
    ParsedEnvVariables.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getAdminUserDetailService = async (
  username: string,
  expectedRole: string
) => {
  const user = await User.findOne({ username, role: expectedRole }).select(
    '-password -__v'
  );
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
          $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
        },
        closeRequests: {
          $sum: { $cond: [{ $eq: ['$status', 'CLOSE_REQUEST'] }, 1, 0] },
        },
        totalContribution: { $sum: '$contributionAmount' }, // Assuming this is requested metric
      },
    },
  ]);

  const depStats = await Deposit.aggregate([
    { $match: { userId, status: 'APPROVED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const wdStats = await Withdrawal.aggregate([
    { $match: { userId, status: 'APPROVED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
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
      transactions: depositsCount + wdCount + invCount,
    },
  };
};
