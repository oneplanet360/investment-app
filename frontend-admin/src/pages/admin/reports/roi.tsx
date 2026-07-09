import { roiLogs } from "../../../lib/data";

const totalPaid = roiLogs.filter(r => r.status === "credited").reduce((s, r) => s + r.amount, 0);
const avgRate = roiLogs.length ? (roiLogs.reduce((s, r) => s + r.roiRate, 0) / roiLogs.length).toFixed(2) : "0.00";

// Group by month
const byMonth = roiLogs.reduce((acc, r) => {
  const key = new Date(r.creditedAt).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  if (!acc[key]) acc[key] = { count: 0, total: 0 };
  acc[key].count++;
  acc[key].total += r.amount;
  return acc;
}, {} as Record<string, { count: number; total: number }>);

const months = Object.entries(byMonth).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

export default function RoiReport() {
  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">ROI Report</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total ROI Paid", value: `$${totalPaid.toFixed(2)}`, color: "text-emerald-600" },
          { label: "Total Credits", value: roiLogs.filter(r => r.status === "credited").length, color: "text-indigo-600" },
          { label: "Avg ROI Rate", value: `${avgRate}%`, color: "text-violet-600" },
          { label: "Unique Investors", value: new Set(roiLogs.map(r => r.username)).size, color: "text-sky-600" },
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
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Month</th>
                <th className="text-center px-5 py-3 font-medium">Credits</th>
                <th className="text-right px-5 py-3 font-medium">Total Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {months.map(([month, { count, total }]) => (
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
