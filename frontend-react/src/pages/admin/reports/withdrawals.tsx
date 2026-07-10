import { useAdminWithdrawalReport } from "../../../services/admin/adminReports/adminReports.query";

export default function WithdrawalsReport() {
  const { data: stats, isLoading, error, isError } = useAdminWithdrawalReport();

  if (error || isError) {
    return <div className="p-6 text-red-500">Error: {String(error)}</div>;
  }

  if (isLoading) {
    return <div className="min-h-full bg-[var(--theme-bg)] p-6 text-center text-gray-500">Loading report...</div>;
  }

  if (!stats) return null;

  const { investor, agent } = stats;

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">Withdrawals Report</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Investor Approved", value: `$${investor.approved.total.toFixed(2)}`, color: "text-green-600" },
          { label: "Investor Pending",  value: `$${investor.pending.total.toFixed(2)}`,  color: "text-yellow-600" },
          { label: "Agent Approved",    value: `$${agent.approved.total.toFixed(2)}`,    color: "text-indigo-600" },
          { label: "Agent Pending",     value: `$${agent.pending.total.toFixed(2)}`,     color: "text-violet-600" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Investor withdrawals summary */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Investor Withdrawals</h2>
          <div className="space-y-3">
            {[
              { label: "Approved", value: investor.approved.total, count: investor.approved.count, color: "bg-green-500" },
              { label: "Pending",  value: investor.pending.total,  count: investor.pending.count,  color: "bg-yellow-400" },
              { label: "Rejected", value: investor.rejected.total, count: investor.rejected.count, color: "bg-red-400" },
            ].map(({ label, value, count, color }) => {
              const total = investor.approved.total + investor.pending.total + investor.rejected.total;
              const pct = total ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label} ({count})</span>
                    <span className="font-semibold text-gray-800">${value.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent commission withdrawals summary */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Agent Commission Withdrawals</h2>
          <div className="space-y-3">
            {[
              { label: "Approved", value: agent.approved.total, count: agent.approved.count, color: "bg-indigo-500" },
              { label: "Pending",  value: agent.pending.total,  count: agent.pending.count,  color: "bg-yellow-400" },
              { label: "Rejected", value: agent.rejected.total, count: agent.rejected.count, color: "bg-red-400" },
            ].map(({ label, value, count, color }) => {
              const total = agent.approved.total + agent.pending.total + agent.rejected.total;
              const pct = total ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label} ({count})</span>
                    <span className="font-semibold text-gray-800">${value.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
