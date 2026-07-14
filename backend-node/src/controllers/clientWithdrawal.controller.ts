import { Request, Response } from 'express';
import { customAsyncWrapper } from '../utils/custom.asyncWrapper';
import { customError, generateTransactionId } from '../utils';
import { HttpStatusCode } from '../constants';
import { Withdrawal, WithdrawalStatus, WithdrawalType } from '../database/models/withdrawal.model';
import { User, Agent, Investor, UserRole } from '../database/models/user.model';
import mongoose from 'mongoose';

export const getWithdrawalsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Not authenticated', HttpStatusCode.UNAUTHORIZED);
    }

    const withdrawals = await Withdrawal.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(HttpStatusCode.OK).json({ success: true, withdrawals });
  }
);

export const requestWithdrawalController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Not authenticated', HttpStatusCode.UNAUTHORIZED);
    }

    const { amount, gateway, type } = req.body; 

    if (!amount || amount <= 0 || !gateway || !type) {
      throw new customError('Invalid withdrawal details', HttpStatusCode.BAD_REQUEST);
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new customError('User not found', HttpStatusCode.NOT_FOUND);

    if (user.kycStatus !== 'APPROVED') {
      throw new customError('KYC must be APPROVED to request a withdrawal', HttpStatusCode.BAD_REQUEST);
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const existingWithdrawal = await Withdrawal.findOne({
      userId: user._id,
      createdAt: { $gte: startOfMonth }
    });

    if (existingWithdrawal) {
      throw new customError('You have already made a withdrawal this month', HttpStatusCode.BAD_REQUEST);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (type === WithdrawalType.COMMISSION) {
        if (user.role !== UserRole.AGENT) {
          throw new customError('Only agents can withdraw commissions', HttpStatusCode.BAD_REQUEST);
        }
        
        const updatedAgent = await Agent.findOneAndUpdate(
          { _id: user._id, commissionBalance: { $gte: amount } },
          { $inc: { commissionBalance: -amount } },
          { new: true, session }
        );

        if (!updatedAgent) {
          throw new customError('Insufficient commission balance or concurrent update', HttpStatusCode.BAD_REQUEST);
        }
      } else {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id, walletBalance: { $gte: amount } },
          { $inc: { walletBalance: -amount } },
          { new: true, session }
        );

        if (!updatedUser) {
          throw new customError('Insufficient wallet balance or concurrent update', HttpStatusCode.BAD_REQUEST);
        }
      }

      const charge = 0;
      const trxId = generateTransactionId();

      const withdrawal = await Withdrawal.create([{
        trxId,
        userId: user._id,
        amount,
        gateway,
        charge,
        conversionCurrency: 'USD',
        conversionRate: 1,
        convertedAmount: amount - charge,
        type,
        status: WithdrawalStatus.PENDING,
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Withdrawal requested successfully',
        withdrawal: withdrawal[0],
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
);
