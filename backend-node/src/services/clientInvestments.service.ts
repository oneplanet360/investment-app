import mongoose, { Types } from 'mongoose';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';
import { Investor, Agent } from '../database/models/user.model';
import { Investment, InvestmentType, InvestmentStatus } from '../database/models/investment.model';
import { Setting } from '../database/models/setting.model';
import { Commission, CommissionStatus } from '../database/models/commission.model';
import crypto from 'crypto';

export const getClientInvestmentsService = async (userId: string) => {
  return await Investment.find({ userId }).sort({ createdAt: -1 });
};

export const closeInvestmentRequestService = async (userId: string, trxId: string) => {
  const investment = await Investment.findOne({ userId, trxId });
  if (!investment) {
    throw new customError('Investment not found', HttpStatusCode.NOT_FOUND);
  }
  if (investment.status !== InvestmentStatus.ACTIVE) {
    throw new customError('Only active investments can be closed', HttpStatusCode.BAD_REQUEST);
  }
  
  investment.status = InvestmentStatus.CLOSE_REQUEST;
  await investment.save();
  return investment;
};

/**
 * Creates an investment and triggers the commission distribution flow using a transaction.
 */
export const createInvestmentService = async (
  userId: string,
  amount: number,
  type: InvestmentType = InvestmentType.INITIAL,
  paymentProof: string,
  transactionId: string
) => {
  if (amount <= 0) {
    throw new customError('Investment amount must be greater than 0', HttpStatusCode.BAD_REQUEST);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const investor = await Investor.findById(userId).session(session);
    if (!investor) {
      throw new customError('Investor not found', HttpStatusCode.NOT_FOUND);
    }

    if (investor.kycStatus !== 'APPROVED') {
      throw new customError('KYC must be APPROVED to invest', HttpStatusCode.BAD_REQUEST);
    }

    const trxId = crypto.randomBytes(8).toString('hex').toUpperCase();

    const setting = await Setting.findOne().session(session);
    const cycleDays = setting?.roiCycleDays || 30;

    const nextRoiDate = new Date();
    nextRoiDate.setDate(nextRoiDate.getDate() + cycleDays);

    const investment = await Investment.create([{
      userId: investor._id,
      trxId,
      transactionId,
      amount,
      type,
      status: InvestmentStatus.PENDING,
      paymentProof,
      roiCycleStartDate: new Date(),
      nextRoiDate: nextRoiDate,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return investment[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * Distributes commission to agents dynamically based on commissionLevels settings.
 */
export const distributeCommissionService = async (
  investorId: Types.ObjectId,
  investmentId: Types.ObjectId,
  amount: number,
  session: mongoose.mongo.ClientSession
) => {
  const settings = await Setting.findOne().session(session);
  if (!settings || !settings.commissionLevels || settings.commissionLevels.length === 0) {
    return; // No commission settings configured
  }

  const investor = await Investor.findById(investorId).session(session);
  if (!investor || !investor.referredBy) {
    return; 
  }

  let currentAgentId: Types.ObjectId | undefined = investor.referredBy;
  const maxLevel = Math.max(...settings.commissionLevels.map(l => l.level));

  for (let currentLevel = 1; currentLevel <= maxLevel; currentLevel++) {
    if (!currentAgentId) {
      break; 
    }

    const levelSetting = settings.commissionLevels.find((lvl) => lvl.level === currentLevel);
    if (!levelSetting || levelSetting.percentage <= 0) {
      const tempAgent = await Agent.findById(currentAgentId).select('sponsor').session(session);
      currentAgentId = tempAgent?.sponsor;
      continue;
    }

    const agent = await Agent.findById(currentAgentId).session(session);
    if (!agent) {
      break; 
    }

    const commissionAmount = (amount * levelSetting.percentage) / 100;

    await Agent.findByIdAndUpdate(
      agent._id,
      { $inc: { commissionBalance: commissionAmount } },
      { session }
    );

    const trxId = crypto.randomBytes(8).toString('hex').toUpperCase();

    await Commission.create([{
      trxId: `COM-${trxId}`,
      agentId: agent._id,
      investorId: investorId,
      investmentId: investmentId,
      level: currentLevel,
      rate: levelSetting.percentage,
      amount: commissionAmount,
      status: CommissionStatus.PAID,
    }], { session });

    currentAgentId = agent.sponsor;
  }
};
