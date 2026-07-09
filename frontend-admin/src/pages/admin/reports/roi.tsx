import { useAdminRoiReport } from "../../../services/adminReports/adminReports.query";

export default function RoiReport() {
  const { data: stats, isLoading, error, isError } = useAdminRoiReport();

  if (error || isError) {
    return <div className="p-6 text-red-500">Error: {String(error)}</div>;
  }

  if (isLoading) {
    return <div className="min-h-full bg-(--theme-bg) p-6 text-center text-gray-500">Loading report...</div>;
  }

  if (!stats) return null;

  const { totalPaid, totalCredits, avgRate, uniqueInvestors, byMonth } = stats;

  return (
    <div className="min-h-full bg-(--theme-bg) p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">ROI Report</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total ROI Paid", value: `$${totalPaid.toFixed(2)}`, color: "text-emerald-600" },
          { label: "Total Credits", value: totalCredits, color: "text-indigo-600" },
          { label: "Avg ROI Rate", value: `${avgRate}%`, color: "text-violet-600" },
          { label: "Unique Investors", value: uniqueInvestors, color: "text-sky-600" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Monthly ROI Payouts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-100">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Month</th>
                <th className="text-center px-5 py-3 font-medium">Credits</th>
                <th className="text-right px-5 py-3 font-medium">Total Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {byMonth.length === 0 ? <tr><td colSpan={3} className="text-center py-6 text-gray-400">No data available</td></tr> : null}
              {byMonth.map(([month, { count, total }]) => (
                <tr key={month} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-700">{month}</td>
                  <td className="px-5 py-3.5 text-center text-gray-600">{count}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">${total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
