import { User } from '../database/models/user.model';
import { Investment } from '../database/models/investment.model';
import { Deposit } from '../database/models/deposit.model';
import { Withdrawal } from '../database/models/withdrawal.model';
import { Roi } from '../database/models/roi.model';

export const getAdminDashboardStatsService = async () => {
  // Users
  const totalMembers = await User.countDocuments({ role: 'user' });
  const activeMembers = await User.countDocuments({ role: 'user', isBanned: false });
  // last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newRegistrations = await User.countDocuments({ role: 'user', createdAt: { $gte: sevenDaysAgo } });

  // Investments
  const invStats = await Investment.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalBusiness = invStats[0]?.total || 0;

  // ROI paid
  const roiStats = await Roi.aggregate([
    { $match: { status: 'CREDITED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalIncomePaid = roiStats[0]?.total || 0;

  // Deposits
  const depStats = await Deposit.aggregate([
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        charge: { $sum: '$charge' }
      }
    }
  ]);
  let totalDeposited = 0, pendingDeposits = 0, rejectedDeposits = 0, depositedCharge = 0;
  depStats.forEach(d => {
    if (d._id === 'APPROVED') { totalDeposited = d.total; depositedCharge = d.charge; }
    if (d._id === 'PENDING') pendingDeposits = d.count;
    if (d._id === 'REJECTED') rejectedDeposits = d.count;
  });

  // Withdrawals
  const wdStats = await Withdrawal.aggregate([
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        charge: { $sum: '$charge' }
      }
    }
  ]);
  let totalWithdrawn = 0, pendingWithdrawals = 0, rejectedWithdrawals = 0, withdrawalCharge = 0;
  wdStats.forEach(d => {
    if (d._id === 'APPROVED') { totalWithdrawn = d.total; withdrawalCharge = d.charge; }
    if (d._id === 'PENDING') pendingWithdrawals = d.count;
    if (d._id === 'REJECTED') rejectedWithdrawals = d.count;
  });

  // Recent Transactions
  // get last 3 deposits, last 3 withdrawals, last 3 investments
  const [deposits, withdrawals, investments] = await Promise.all([
    Deposit.find().sort({ createdAt: -1 }).limit(4).populate('userId', 'name username'),
    Withdrawal.find().sort({ createdAt: -1 }).limit(4).populate('userId', 'name username'),
    Investment.find().sort({ createdAt: -1 }).limit(4).populate('userId', 'name username')
  ]);

  const recentTransactions = [];

  deposits.forEach((d: any) => {
     recentTransactions.push({
       id: d._id.toString(),
       user: d.userId?.name || 'Unknown',
       username: d.userId?.username || 'unknown',
       type: 'deposit',
       amount: d.amount,
       status: d.status.toLowerCase(),
       date: d.createdAt
     });
  });

  withdrawals.forEach((w: any) => {
     recentTransactions.push({
       id: w._id.toString(),
       user: w.userId?.name || 'Unknown',
       username: w.userId?.username || 'unknown',
       type: 'withdrawal',
       amount: w.amount,
       status: w.status.toLowerCase(),
       date: w.createdAt
     });
  });

  investments.forEach((i: any) => {
     recentTransactions.push({
       id: i._id.toString(),
       user: i.userId?.name || 'Unknown',
       username: i.userId?.username || 'unknown',
       type: 'investment',
       amount: i.amount,
       status: i.status === 'ACTIVE' || i.status === 'COMPLETED' ? 'completed' : 'pending',
       date: i.createdAt
     });
  });

  recentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    stats: {
      totalMembers, activeMembers, newRegistrations,
      totalBusiness, totalIncomePaid,
      totalDeposited, pendingDeposits, rejectedDeposits, depositedCharge,
      totalWithdrawn, pendingWithdrawals, rejectedWithdrawals, withdrawalCharge
    },
    recentTransactions: recentTransactions.slice(0, 10)
  };
};
