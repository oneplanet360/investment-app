import { useAdminCommissionReport } from "../../../services/admin/adminReports/adminReports.query";

export default function CommissionsReport() {
  const { data: stats, isLoading, error, isError } = useAdminCommissionReport();

  if (error || isError) {
    console.error("Commission report error:", error);
    return <div className="p-6 text-red-500">Error: {String(error)}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-full bg-(--theme-bg) p-6 text-center text-gray-500">
        Loading report...
      </div>
    );
  }

  if (!stats) return null;

  console.log("Commission stats loaded:", stats);

  const { totalPaid, levelDistribution, topEarningAgents } = stats;

  return (
    <div className="min-h-full bg-(--theme-bg) p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">
        Commissions Report
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {([1, 2, 3, 4] as const).map((lvl) => {
          const t = levelDistribution[lvl] || 0;
          return (
            <div key={lvl} className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-xs text-gray-500">Level {lvl} Total</p>
              <p className="text-xl font-bold mt-1 text-indigo-600">
                ${t.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Level distribution */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Distribution by Level
          </h2>
          {([1, 2, 3, 4] as const).map((lvl) => {
            const t = levelDistribution[lvl] || 0;
            const pct = totalPaid ? Math.round((t / totalPaid) * 100) : 0;
            const colors = [
              "bg-indigo-500",
              "bg-violet-500",
              "bg-sky-500",
              "bg-teal-500",
            ];
            return (
              <div key={lvl} className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Level {lvl}</span>
                  <span className="font-semibold text-gray-800">
                    ${t.toFixed(2)}{" "}
                    <span className="text-gray-400 font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors[lvl - 1]} rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          <p className="text-xs text-right text-gray-400 mt-3">
            Total:{" "}
            <strong className="text-emerald-600">
              ${totalPaid.toFixed(2)}
            </strong>
          </p>
        </div>

        {/* Per agent */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Top Earning Agents
          </h2>
          <div className="space-y-2">
            {topEarningAgents.length === 0 ? (
              <p className="text-sm text-gray-500">No data available</p>
            ) : null}
            {topEarningAgents.map(([username, { name, total, count }], i) => (
              <div
                key={username}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{name}</p>
                    <p className="text-xs text-indigo-500">
                      @{username} · {count} credits
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
