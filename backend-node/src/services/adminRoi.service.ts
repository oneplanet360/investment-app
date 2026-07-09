import { Roi } from '../database/models/roi.model';
import { User } from '../database/models/user.model';
import { Investment } from '../database/models/investment.model';

export const getRoiLogsService = async (
  page: number = 1,
  limit: number = 20,
  search?: string
) => {
  const query: any = {};

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
    status: 'CREDITED',
  });
  const pendingCount = await Roi.countDocuments({
    ...query,
    status: 'PENDING',
  });
  const totalPaidAggr = await Roi.aggregate([
    { $match: { ...query, status: 'CREDITED' } },
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
