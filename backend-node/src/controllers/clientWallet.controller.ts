import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User, UserRole, Agent, Investor } from '../database/models/user.model';
import { Deposit } from '../database/models/deposit.model';
import { Withdrawal } from '../database/models/withdrawal.model';
import { Roi } from '../database/models/roi.model';
import { Commission } from '../database/models/commission.model';
import { customAsyncWrapper } from '../utils/custom.asyncWrapper';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';

export const getWalletController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Not authenticated', HttpStatusCode.UNAUTHORIZED);
    }

    // Fetch the correct discriminator based on the user's role
    let userDetails;
    if (req.user.role === UserRole.AGENT) {
      userDetails = await Agent.findById(req.user._id);
    } else {
      userDetails = await Investor.findById(req.user._id);
    }

    if (!userDetails) {
      throw new customError('User not found', HttpStatusCode.NOT_FOUND);
    }

    // Get basic stats
    const totalDeposits = await Deposit.aggregate([
      { $match: { userId: req.user._id, status: 'SUCCESSFUL' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalWithdrawals = await Withdrawal.aggregate([
      { $match: { userId: req.user._id, status: 'APPROVED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(HttpStatusCode.OK).json({
      success: true,
      data: {
        walletBalance: userDetails.walletBalance,
        commissionBalance: req.user.role === UserRole.AGENT ? (userDetails as any).commissionBalance : 0,
        investmentBalance: req.user.role === UserRole.INVESTOR ? (userDetails as any).investmentBalance : 0,
        roiBalance: req.user.role === UserRole.INVESTOR ? (userDetails as any).roiBalance : 0,
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
      }
    });
  }
);

export const getWalletTransactionsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Not authenticated', HttpStatusCode.UNAUTHORIZED);
    }

    // Combine deposits and withdrawals to form a ledger
    const deposits = await Deposit.find({ userId: req.user._id })
      .select('trxId amount gateway status createdAt')
      .lean();
      
    const withdrawals = await Withdrawal.find({ userId: req.user._id })
      .select('trxId amount gateway status createdAt type')
      .lean();

    const rois = await Roi.find({ investorId: req.user._id, status: 'APPROVED' })
      .select('trxId amount status createdAt')
      .lean();

    const commissions = await Commission.find({ receiverId: req.user._id, status: 'APPROVED' })
      .select('trxId amount status createdAt')
      .lean();

    const formattedDeposits = deposits.map(d => ({
      ...d,
      transactionType: 'DEPOSIT',
      amountDisplay: `+$${d.amount.toFixed(2)}`
    }));

    const formattedWithdrawals = withdrawals.map(w => ({
      ...w,
      transactionType: 'WITHDRAWAL',
      amountDisplay: `-$${w.amount.toFixed(2)}`
    }));

    const formattedRois = rois.map(r => ({
      ...r,
      transactionType: 'ROI',
      amountDisplay: `+$${r.amount.toFixed(2)}`
    }));

    const formattedCommissions = commissions.map(c => ({
      ...c,
      transactionType: 'COMMISSION',
      amountDisplay: `+$${c.amount.toFixed(2)}`
    }));

    const transactions = [...formattedDeposits, ...formattedWithdrawals, ...formattedRois, ...formattedCommissions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.status(HttpStatusCode.OK).json({
      success: true,
      transactions,
    });
  }
);
