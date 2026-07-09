import { Investment } from '../database/models/investment.model';
import { Deposit } from '../database/models/deposit.model';
import { Roi } from '../database/models/roi.model';
import { Commission } from '../database/models/commission.model';
import { Withdrawal } from '../database/models/withdrawal.model';

export const getInvestmentReportStatsService = async () => {
  // Investments total and by status
  const invStats = await Investment.aggregate([
    {
      $group: {
        _id: '$status',
        totalAmount: { $sum: '$amount' },
        totalReturn: { $sum: '$totalReturn' },
        count: { $sum: 1 },
      },
    },
  ]);

  let totalInvested = 0;
  let totalProjectedReturn = 0;
  let totalActive = 0;
  let totalCompleted = 0;
  let totalClosed = 0;
  let totalInvestments = 0;

  invStats.forEach((s) => {
    totalInvested += s.totalAmount;
    totalProjectedReturn += s.totalReturn;
    totalInvestments += s.count;
    if (s._id === 'ACTIVE') totalActive = s.count;
    if (s._id === 'COMPLETED') totalCompleted = s.count;
    if (s._id === 'CLOSED') totalClosed = s.count;
  });

  // Top Investors
  const topInvestorsRaw = await Investment.aggregate([
    {
      $group: {
        _id: '$userId',
        amount: { $sum: '$amount' },
      },
    },
    { $sort: { amount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        username: '$user.username',
        amount: 1,
      },
    },
  ]);

  const topInvestors = topInvestorsRaw.map((i) => [i.username, i.amount]);

  // Total ROI Paid
  const roiAggr = await Roi.aggregate([
    { $match: { status: 'CREDITED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalRoiPaid = roiAggr[0]?.total || 0;

  // Total Commissions
  const commAggr = await Commission.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalCommissions = commAggr[0]?.total || 0;

  // Commission distribution
  const commLevelAggr = await Commission.aggregate([
    {
      $group: { _id: '$level', total: { $sum: '$amount' }, count: { $sum: 1 } },
    },
  ]);
  const commissionDistribution = {
    1: { amount: 0, count: 0 },
    2: { amount: 0, count: 0 },
    3: { amount: 0, count: 0 },
    4: { amount: 0, count: 0 },
  };
  commLevelAggr.forEach((c) => {
    commissionDistribution[c._id as keyof typeof commissionDistribution] = {
      amount: c.total,
      count: c.count,
    };
  });

  // Total Top-Ups (Deposits)
  const depositAggr = await Deposit.aggregate([
    { $match: { status: 'APPROVED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalTopUps = depositAggr[0]?.total || 0;

  return {
    totalInvested,
    totalProjectedReturn,
    totalRoiPaid,
    totalCommissions,
    totalTopUps,
    totalInvestments,
    byStatus: {
      active: totalActive,
      completed: totalCompleted,
      closed: totalClosed,
    },
    topInvestors,
    commissionDistribution,
  };
};

export const getRoiReportStatsService = async () => {
  const roiAggr = await Roi.aggregate([
    {
      $group: {
        _id: '$status',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        totalRate: { $sum: '$roiRate' },
      },
    },
  ]);

  let totalPaid = 0;
  let totalCredits = 0;
  let totalRateSum = 0;
  let allCount = 0;

  roiAggr.forEach((s) => {
    allCount += s.count;
    totalRateSum += s.totalRate || 0;
    if (s._id === 'CREDITED') {
      totalPaid += s.totalAmount;
      totalCredits += s.count;
    }
  });

  const avgRate = allCount > 0 ? (totalRateSum / allCount).toFixed(2) : '0.00';

  const uniqueInvestors = (await Roi.distinct('investorId')).length;

  const monthlyRaw = await Roi.aggregate([
    { $match: { status: 'CREDITED' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const byMonth = monthlyRaw.map((m) => [
    `${monthNames[m._id.month - 1]} ${m._id.year}`,
    { count: m.count, total: m.total },
  ]);

  return {
    totalPaid,
    totalCredits,
    avgRate,
    uniqueInvestors,
    byMonth,
  };
};

export const getWithdrawalReportStatsService = async () => {
  const aggr = await Withdrawal.aggregate([
    {
      $group: {
        _id: { type: '$type', status: '$status' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  let investorApproved = 0;
  let investorPending = 0;
  let investorRejected = 0;
  let investorApprovedCount = 0;
  let investorPendingCount = 0;
  let investorRejectedCount = 0;

  let agentApproved = 0;
  let agentPending = 0;
  let agentRejected = 0;
  let agentApprovedCount = 0;
  let agentPendingCount = 0;
  let agentRejectedCount = 0;

  aggr.forEach((s) => {
    if (s._id.type === 'INVESTMENT_ROI') {
      if (s._id.status === 'APPROVED') {
        investorApproved = s.total;
        investorApprovedCount = s.count;
      }
      if (s._id.status === 'PENDING') {
        investorPending = s.total;
        investorPendingCount = s.count;
      }
      if (s._id.status === 'REJECTED') {
        investorRejected = s.total;
        investorRejectedCount = s.count;
      }
    } else if (s._id.type === 'COMMISSION') {
      if (s._id.status === 'APPROVED') {
        agentApproved = s.total;
        agentApprovedCount = s.count;
      }
      if (s._id.status === 'PENDING') {
        agentPending = s.total;
        agentPendingCount = s.count;
      }
      if (s._id.status === 'REJECTED') {
        agentRejected = s.total;
        agentRejectedCount = s.count;
      }
    }
  });

  return {
    investor: {
      approved: { total: investorApproved, count: investorApprovedCount },
      pending: { total: investorPending, count: investorPendingCount },
      rejected: { total: investorRejected, count: investorRejectedCount },
    },
    agent: {
      approved: { total: agentApproved, count: agentApprovedCount },
      pending: { total: agentPending, count: agentPendingCount },
      rejected: { total: agentRejected, count: agentRejectedCount },
    },
  };
};

export const getCommissionReportStatsService = async () => {
  const aggr = await Commission.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalPaid = aggr[0]?.total || 0;

  const levelAggr = await Commission.aggregate([
    { $group: { _id: '$level', total: { $sum: '$amount' } } },
  ]);

  const levelDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };
  levelAggr.forEach((l) => {
    levelDistribution[l._id as keyof typeof levelDistribution] = l.total;
  });

  const topAgentsRaw = await Commission.aggregate([
    {
      $group: {
        _id: '$agentId',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'agent',
      },
    },
    { $unwind: '$agent' },
    {
      $project: {
        username: '$agent.username',
        firstName: '$agent.firstName',
        lastName: '$agent.lastName',
        name: '$agent.name',
        total: 1,
        count: 1,
      },
    },
  ]);

  const topEarningAgents = topAgentsRaw.map((a) => {
    const fullName =
      a.firstName || a.lastName
        ? `${a.firstName || ''} ${a.lastName || ''}`.trim()
        : a.name || a.username;
    return [a.username, { name: fullName, total: a.total, count: a.count }];
  });

  return {
    totalPaid,
    levelDistribution,
    topEarningAgents,
  };
};
