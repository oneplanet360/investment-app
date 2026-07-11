import { TrendingUp, DollarSign, BarChart2, ArrowUpRight } from "lucide-react";
import { useAdminInvestmentReport } from "../../../services/admin/adminReports/adminReports.query";

export default function InvestmentReport() {
  const { data: stats, isLoading, error, isError } = useAdminInvestmentReport();

  if (error || isError) {
    console.error("InvestmentReport query error:", error);
    return (
      <div className="p-6 text-red-500">
        Error loading report: {String(error)}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 text-center text-gray-500">
        Loading report...
      </div>
    );
  }

  console.log("InvestmentReport stats:", stats);

  if (!stats) return null;

  const {
    totalInvested,
    totalProjectedReturn,
    totalRoiPaid,
    totalCommissions,
    totalTopUps,
    totalInvestments,
    byStatus,
    topInvestors,
    commissionDistribution,
  } = stats;

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">
        Investment Report
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Invested",
            value: `$${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            icon: <DollarSign size={20} className="text-indigo-600" />,
            bg: "bg-indigo-50",
          },
          {
            label: "Projected Returns",
            value: `$${totalProjectedReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            icon: <TrendingUp size={20} className="text-emerald-600" />,
            bg: "bg-emerald-50",
          },
          {
            label: "ROI Paid Out",
            value: `$${totalRoiPaid.toFixed(2)}`,
            icon: <ArrowUpRight size={20} className="text-green-600" />,
            bg: "bg-green-50",
          },
          {
            label: "Total Top-ups",
            value: `$${totalTopUps.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            icon: <BarChart2 size={20} className="text-violet-600" />,
            bg: "bg-violet-50",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3"
          >
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center ${c.bg}`}
            >
              {c.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{c.label}</p>
              <p className="text-base font-bold text-gray-800">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Status breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Investment Status Breakdown
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Active",
                count: byStatus.active,
                total: totalInvestments,
                color: "bg-indigo-500",
              },
              {
                label: "Completed",
                count: byStatus.completed,
                total: totalInvestments,
                color: "bg-green-500",
              },
              {
                label: "Closed",
                count: byStatus.closed,
                total: totalInvestments,
                color: "bg-gray-400",
              },
            ].map(({ label, count, total, color }) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-800">
                      {count}{" "}
                      <span className="text-gray-400 font-normal">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top investors */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Top Investors by Volume
          </h2>
          <div className="space-y-2">
            {topInvestors.length === 0 ? (
              <p className="text-sm text-gray-500">No data</p>
            ) : null}
            {topInvestors.map(([username, amount], i) => (
              <div
                key={username}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-indigo-500">@{username}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  $
                  {amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission summary */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Commission Distribution by Level
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {([1, 2, 3, 4] as const).map((lvl) => {
            const levelData = commissionDistribution[
              lvl as keyof typeof commissionDistribution
            ] || { amount: 0, count: 0 };
            return (
              <div
                key={lvl}
                className="text-center p-4 bg-indigo-50 rounded-lg"
              >
                <p className="text-xs text-gray-500 mb-1">Level {lvl}</p>
                <p className="text-lg font-bold text-indigo-600">
                  ${levelData.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  {levelData.count} transactions
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-right">
          Total commissions paid:{" "}
          <strong className="text-emerald-600">
            ${totalCommissions.toFixed(2)}
          </strong>
        </p>
      </div>
    </div>
  );
}
