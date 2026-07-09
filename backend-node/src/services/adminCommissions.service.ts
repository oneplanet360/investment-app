import { Commission } from '../database/models/commission.model';
import { User } from '../database/models/user.model';
import { Investment } from '../database/models/investment.model';

export const getCommissionLogsService = async (
  page: number = 1,
  limit: number = 20,
  search?: string,
  level?: string
) => {
  const query: any = {};

  if (level && level !== 'all') {
    query.level = parseInt(level, 10);
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
      { agentId: { $in: userIds } },
      { investorId: { $in: userIds } },
      { investmentId: { $in: investmentIds } },
    ];
  }

  const skip = (page - 1) * limit;

  const commissionLogs = await Commission.find(query)
    .populate('agentId', 'name firstName lastName username')
    .populate('investorId', 'username')
    .populate('investmentId', 'trxId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Commission.countDocuments(query);

  const totalPaidAggr = await Commission.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalPaid = totalPaidAggr.length > 0 ? totalPaidAggr[0].total : 0;

  const levelTotalsAggr = await Commission.aggregate([
    { $match: query },
    { $group: { _id: '$level', total: { $sum: '$amount' } } },
  ]);
  const levelTotals = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };
  levelTotalsAggr.forEach((curr) => {
    levelTotals[curr._id as keyof typeof levelTotals] = curr.total;
  });

  return {
    data: commissionLogs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalPaid,
        levelTotals,
      },
    },
  };
};
