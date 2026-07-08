import { investments, roiLogs, commissionLogs, topUps } from "../../../lib/data";
import { TrendingUp, DollarSign, BarChart2, ArrowUpRight } from "lucide-react";

const totalInvested = investments.reduce((s, i) => s + i.initialDeposit, 0);
const totalReturn = investments.reduce((s, i) => s + i.totalReturn, 0);
const totalRoi = roiLogs.reduce((s, r) => s + r.amount, 0);
const totalCommissions = commissionLogs.reduce((s, c) => s + c.amount, 0);
const totalTopUps = topUps.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);

const byStatus = {
  active: investments.filter(i => i.status === "active").length,
  completed: investments.filter(i => i.status === "completed").length,
  closed: investments.filter(i => i.status === "closed").length,
};

const topInvestors = Object.entries(
  investments.reduce((acc, inv) => {
    acc[inv.username] = (acc[inv.username] || 0) + inv.initialDeposit;
    return acc;
  }, {} as Record<string, number>)
).sort((a, b) => b[1] - a[1]).slice(0, 5);

export default function InvestmentReport() {
  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">Investment Report</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invested", value: `$${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: <DollarSign size={20} className="text-indigo-600" />, bg: "bg-indigo-50" },
          { label: "Projected Returns", value: `$${totalReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: <TrendingUp size={20} className="text-emerald-600" />, bg: "bg-emerald-50" },
          { label: "ROI Paid Out", value: `$${totalRoi.toFixed(2)}`, icon: <ArrowUpRight size={20} className="text-green-600" />, bg: "bg-green-50" },
          { label: "Total Top-ups", value: `$${totalTopUps.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: <BarChart2 size={20} className="text-violet-600" />, bg: "bg-violet-50" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${c.bg}`}>{c.icon}</div>
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
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Investment Status Breakdown</h2>
          <div className="space-y-3">
            {([
              { label: "Active", count: byStatus.active, total: investments.length, color: "bg-indigo-500" },
              { label: "Completed", count: byStatus.completed, total: investments.length, color: "bg-green-500" },
              { label: "Closed", count: byStatus.closed, total: investments.length, color: "bg-gray-400" },
            ]).map(({ label, count, total, color }) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-800">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top investors */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Investors by Volume</h2>
          <div className="space-y-2">
            {topInvestors.map(([username, amount], i) => (
              <div key={username} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-sm text-indigo-500">@{username}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission summary */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Commission Distribution by Level</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {([1,2,3,4] as const).map((lvl) => {
            const total = commissionLogs.filter(c => c.level === lvl).reduce((s, c) => s + c.amount, 0);
            return (
              <div key={lvl} className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Level {lvl}</p>
                <p className="text-lg font-bold text-indigo-600">${total.toFixed(2)}</p>
                <p className="text-xs text-gray-400">{commissionLogs.filter(c => c.level === lvl).length} transactions</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-right">Total commissions paid: <strong className="text-emerald-600">${totalCommissions.toFixed(2)}</strong></p>
      </div>
    </div>
  );
}
