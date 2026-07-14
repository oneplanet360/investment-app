import { Request, Response } from 'express';
import { customAsyncWrapper } from '../utils/custom.asyncWrapper';
import { customError, generateTransactionId } from '../utils';
import { HttpStatusCode } from '../constants';
import { Deposit, DepositStatus } from '../database/models/deposit.model';
import { User } from '../database/models/user.model';

export const getClientDepositsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Not authenticated', HttpStatusCode.UNAUTHORIZED);
    }

    const deposits = await Deposit.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(HttpStatusCode.OK).json({ success: true, deposits });
  }
);

export const submitClientDepositController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Not authenticated', HttpStatusCode.UNAUTHORIZED);
    }

    const { amount, gateway } = req.body;

    if (!amount || amount <= 0 || !gateway) {
      throw new customError('Invalid deposit details', HttpStatusCode.BAD_REQUEST);
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new customError('User not found', HttpStatusCode.NOT_FOUND);

    if (user.kycStatus !== 'APPROVED') {
      throw new customError('KYC must be APPROVED to deposit', HttpStatusCode.BAD_REQUEST);
    }

    const trxId = generateTransactionId();
    const charge = 0; 
    const conversionRate = 1;

    const deposit = await Deposit.create({
      trxId,
      userId: user._id,
      amount,
      gateway,
      charge,
      conversionCurrency: 'USD',
      conversionRate,
      convertedAmount: amount - charge,
      status: DepositStatus.PENDING,
    });

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: 'Deposit requested successfully',
      deposit,
    });
  }
);
