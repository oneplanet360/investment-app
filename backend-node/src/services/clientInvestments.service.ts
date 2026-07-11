import { Types } from 'mongoose';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';
import { Investor, Agent } from '../database/models/user.model';
import { Investment, InvestmentType, InvestmentStatus } from '../database/models/investment.model';
import { Setting } from '../database/models/setting.model';
import { Commission, CommissionStatus } from '../database/models/commission.model';
import crypto from 'crypto';

/**
 * Creates an investment and triggers the commission distribution flow.
 */
export const createInvestmentService = async (
  userId: string,
  amount: number
) => {
  const investor = await Investor.findById(userId);
  if (!investor) {
    throw new customError('Investor not found', HttpStatusCode.NOT_FOUND);
  }

  // Ensure investor has enough wallet balance
  if (investor.walletBalance < amount) {
    throw new customError('Insufficient wallet balance to invest', HttpStatusCode.BAD_REQUEST);
  }

  // Deduct from wallet and add to investment balance
  investor.walletBalance -= amount;
  investor.investmentBalance += amount;
  await investor.save();

  const trxId = crypto.randomBytes(8).toString('hex').toUpperCase();

  const nextRoiDate = new Date();
  nextRoiDate.setMonth(nextRoiDate.getMonth() + 1); // Basic 1-month ROI cycle

  const investment = await Investment.create({
    userId: investor._id,
    trxId,
    amount,
    type: InvestmentType.INITIAL, // Assuming first or basic
    status: InvestmentStatus.ACTIVE,
    roiCycleStartDate: new Date(),
    nextRoiDate: nextRoiDate,
  });

  // Distribute commissions up the sponsorship tree
  await distributeCommissionService(investor._id as Types.ObjectId, investment._id as Types.ObjectId, amount);

  return investment;
};

/**
 * Distributes commission to agents up to 4 levels deep.
 */
export const distributeCommissionService = async (
  investorId: Types.ObjectId,
  investmentId: Types.ObjectId,
  amount: number
) => {
  const settings = await Setting.findOne();
  if (!settings || !settings.commissionLevels || settings.commissionLevels.length === 0) {
    return; // No commission settings configured
  }

  const investor = await Investor.findById(investorId);
  if (!investor || !investor.referredBy) {
    return; // Investor has no sponsor (Level 1)
  }

  let currentAgentId: Types.ObjectId | undefined = investor.referredBy;

  for (let currentLevel = 1; currentLevel <= 4; currentLevel++) {
    if (!currentAgentId) {
      break; // End of the chain
    }

    // Find the commission rate for this level
    const levelSetting = settings.commissionLevels.find((lvl) => lvl.level === currentLevel);
    if (!levelSetting || levelSetting.percentage <= 0) {
      // Fetch the next agent anyway in case a higher level has commission
      const tempAgent = await Agent.findById(currentAgentId).select('sponsor');
      currentAgentId = tempAgent?.sponsor;
      continue;
    }

    const agent = await Agent.findById(currentAgentId);
    if (!agent) {
      break; // Agent not found in DB
    }

    const commissionAmount = (amount * levelSetting.percentage) / 100;

    // Award commission to agent
    agent.commissionBalance += commissionAmount;
    await agent.save();

    const trxId = crypto.randomBytes(8).toString('hex').toUpperCase();

    // Create commission log
    await Commission.create({
      trxId: `COM-${trxId}`,
      agentId: agent._id,
      investorId: investorId,
      investmentId: investmentId,
      level: currentLevel,
      rate: levelSetting.percentage,
      amount: commissionAmount,
      status: CommissionStatus.PAID,
    });

    // Move to the next level (this agent's sponsor)
    currentAgentId = agent.sponsor;
  }
};
