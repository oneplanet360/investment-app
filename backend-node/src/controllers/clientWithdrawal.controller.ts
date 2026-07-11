import { Request, Response } from 'express';
import { customAsyncWrapper } from '../utils/custom.asyncWrapper';
import { customError, generateTransactionId } from '../utils';
import { HttpStatusCode } from '../constants';
import { Withdrawal, WithdrawalStatus, WithdrawalType } from '../database/models/withdrawal.model';
import { User, Agent, Investor, UserRole } from '../database/models/user.model';

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

    const { amount, gateway, type } = req.body; // type e.g., 'COMMISSION' or 'ROI_WALLET'

    if (!amount || amount <= 0 || !gateway || !type) {
      throw new customError('Invalid withdrawal details', HttpStatusCode.BAD_REQUEST);
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new customError('User not found', HttpStatusCode.NOT_FOUND);

    // Basic logic to deduct balance
    if (type === WithdrawalType.COMMISSION) {
      if (user.role !== UserRole.AGENT) {
        throw new customError('Only agents can withdraw commissions', HttpStatusCode.BAD_REQUEST);
      }
      const agent = await Agent.findById(user._id);
      if (!agent || agent.commissionBalance < amount) {
        throw new customError('Insufficient commission balance', HttpStatusCode.BAD_REQUEST);
      }
      agent.commissionBalance -= amount;
      await agent.save();
    } else {
      if (user.walletBalance < amount) {
        throw new customError('Insufficient wallet balance', HttpStatusCode.BAD_REQUEST);
      }
      user.walletBalance -= amount;
      await user.save();
    }

    const charge = 0; // Or whatever calculation
    const trxId = generateTransactionId();

    const withdrawal = await Withdrawal.create({
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
    });

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: 'Withdrawal requested successfully',
      withdrawal,
    });
  }
);
