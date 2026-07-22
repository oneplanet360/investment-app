import { Roi, RoiStatus } from '../database/models/roi.model';
import { User, Investor } from '../database/models/user.model';
import { Investment } from '../database/models/investment.model';
import mongoose from 'mongoose';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';
import { distributeCommissionService } from './clientInvestments.service';

export const getRoiLogsService = async (
  page: number = 1,
  limit: number = 20,
  search?: string,
  status?: string
) => {
  const query: any = {};

  if (status && status !== 'all') {
    query.status = status.toUpperCase();
  }

  if (search) {
    const regex = new RegExp(search, 'i');

    const matchingUsers = await User.find({
      $or: [{ username: regex }, { name: regex }],
    }).select('_id');
    const userIds = matchingUsers.map((u) => u._id);

    const matchingInvestments = await Investment.find({ trxId: regex }).select(
      '_id'
    );
    const investmentIds = matchingInvestments.map((i) => i._id);

    query.$or = [
      { trxId: regex },
      { investorId: { $in: userIds } },
      { investmentId: { $in: investmentIds } },
    ];
  }

  const skip = (page - 1) * limit;

  const roiLogs = await Roi.find(query)
    .populate('investorId', 'name firstName lastName username email')
    .populate('investmentId', 'trxId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Roi.countDocuments(query);

  const creditedCount = await Roi.countDocuments({
    ...query,
    status: 'APPROVED',
  });
  const pendingCount = await Roi.countDocuments({
    ...query,
    status: 'PENDING',
  });
  const totalPaidAggr = await Roi.aggregate([
    { $match: { ...query, status: 'APPROVED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalPaid = totalPaidAggr.length > 0 ? totalPaidAggr[0].total : 0;

  return {
    data: roiLogs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: {
        creditedCount,
        pendingCount,
        totalPaid,
      },
    },
  };
};

export const updateRoiStatusService = async (trxId: string, status: RoiStatus, amount?: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const roiLog = await Roi.findOne({ trxId }).session(session);

    if (!roiLog) {
      throw new customError('ROI log not found', HttpStatusCode.NOT_FOUND);
    }

    if (roiLog.status !== RoiStatus.PENDING) {
      throw new customError(
        'Can only update pending ROI logs',
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (status === RoiStatus.APPROVED) {
      if (amount !== undefined && amount >= 0) {
        roiLog.amount = amount;
      }

      // Credit investor
      await Investor.findByIdAndUpdate(
        roiLog.investorId,
        { $inc: { roiBalance: roiLog.amount, walletBalance: roiLog.amount } },
        { session }
      );

      // Distribute commissions based on the ROI amount
      await distributeCommissionService(
        roiLog.investorId as mongoose.Types.ObjectId,
        roiLog.investmentId as mongoose.Types.ObjectId,
        roiLog.amount,
        session
      );
    }

    roiLog.status = status;
    await roiLog.save({ session });

    await session.commitTransaction();
    session.endSession();
    return roiLog;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
