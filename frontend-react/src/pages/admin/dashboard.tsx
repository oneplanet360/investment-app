import {
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowDownToLine,
  AlertCircle,
  XCircle,
  Percent,
  Landmark,
  ArrowUpDown,
} from "lucide-react";
import { useAdminDashboard } from "../../services/admin/adminDashboard/adminDashboard.query";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
};

function StatCard({ label, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

type MiniCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
};

function MiniCard({ label, value, icon, iconBg }: MiniCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
      </div>
      <span className="text-gray-300 group-hover:text-gray-400 transition-colors">
        ›
      </span>
    </div>
  );
}

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const typeColors: Record<string, string> = {
  deposit: "text-green-600",
  withdrawal: "text-red-600",
  investment: "text-indigo-600",
  profit: "text-emerald-600",
};

export default function Dashboard() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 text-center text-red-500">
        Failed to load dashboard data
      </div>
    );
  }

  const s = data.stats;
  const recentTransactions = data.recentTransactions;

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-6">
      <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Members"
          value={s.totalMembers}
          iconBg="bg-indigo-100"
          icon={<Users size={22} className="text-indigo-600" />}
        />
        <StatCard
          label="Active Members"
          value={s.activeMembers}
          iconBg="bg-green-100"
          icon={<UserCheck size={22} className="text-green-600" />}
        />
        <StatCard
          label="New Registrations"
          value={s.newRegistrations}
          iconBg="bg-sky-100"
          icon={<UserPlus size={22} className="text-sky-600" />}
        />
        <StatCard
          label="Total Business"
          value={`$${s.totalBusiness.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`}
          iconBg="bg-violet-100"
          icon={<TrendingUp size={22} className="text-violet-600" />}
        />
        <StatCard
          label="Total Income Paid"
          value={`$${s.totalIncomePaid.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`}
          iconBg="bg-teal-100"
          icon={<DollarSign size={22} className="text-teal-600" />}
        />
        <StatCard
          label="Pending Withdrawals"
          value={s.pendingWithdrawals}
          iconBg="bg-orange-100"
          icon={<Clock size={22} className="text-orange-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Deposits</h2>
          <div className="grid grid-cols-2 gap-1">
            <MiniCard
              label="Total Deposited"
              value={`$${s.totalDeposited.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`}
              iconBg="bg-green-100"
              icon={<ArrowDownToLine size={18} className="text-green-600" />}
            />
            <MiniCard
              label="Pending Deposits"
              value={s.pendingDeposits}
              iconBg="bg-orange-100"
              icon={<AlertCircle size={18} className="text-orange-500" />}
            />
            <MiniCard
              label="Rejected Deposits"
              value={s.rejectedDeposits}
              iconBg="bg-red-100"
              icon={<XCircle size={18} className="text-red-500" />}
            />
            <MiniCard
              label="Deposited Charge"
              value={`$${s.depositedCharge.toFixed(2)} USD`}
              iconBg="bg-violet-100"
              icon={<Percent size={18} className="text-violet-600" />}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Withdrawals
          </h2>
          <div className="grid grid-cols-2 gap-1">
            <MiniCard
              label="Total Withdrawn"
              value={`$${s.totalWithdrawn.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`}
              iconBg="bg-teal-100"
              icon={<Landmark size={18} className="text-teal-600" />}
            />
            <MiniCard
              label="Pending Withdrawals"
              value={s.pendingWithdrawals}
              iconBg="bg-orange-100"
              icon={<AlertCircle size={18} className="text-orange-500" />}
            />
            <MiniCard
              label="Rejected Withdrawals"
              value={s.rejectedWithdrawals}
              iconBg="bg-red-100"
              icon={<XCircle size={18} className="text-red-500" />}
            />
            <MiniCard
              label="Withdrawal Charge"
              value={`$${s.withdrawalCharge.toFixed(2)} USD`}
              iconBg="bg-violet-100"
              icon={<Percent size={18} className="text-violet-600" />}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <ArrowUpDown size={16} className="text-indigo-500" />
          <h2 className="text-sm font-semibold text-gray-700">
            Recent Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{tx.user}</p>
                    <p className="text-xs text-indigo-500">@{tx.username}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`font-medium capitalize ${typeColors[tx.type]}`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 text-right font-semibold ${typeColors[tx.type]}`}
                  >
                    ${tx.amount.toFixed(2)} USD
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[tx.status]}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(tx.date).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
