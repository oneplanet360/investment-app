import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Pagination from "../../../components/common/pagination";
import { roiLogs } from "../../../lib/data";

const PER_PAGE = 20;

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).replace(",", "");
}

export default function RoiLog() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return roiLogs;
    return roiLogs.filter(
      (r) => r.username.toLowerCase().includes(q) || r.trxId.toLowerCase().includes(q) || r.investmentTrxId.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const totalPaid = roiLogs.filter(r => r.status === "credited").reduce((s, r) => s + r.amount, 0);

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total ROI Paid", value: `$${totalPaid.toFixed(2)}`, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Records",   value: roiLogs.length,              color: "text-indigo-600",  bg: "bg-indigo-50"  },
          { label: "Credited",        value: roiLogs.filter(r => r.status === "credited").length, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending",         value: roiLogs.filter(r => r.status === "pending").length,  color: "text-yellow-600", bg: "bg-yellow-50" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">ROI Payment Log</h1>
          <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus-within:border-indigo-400 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Username / TrxID"
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
            />
            <button className="shrink-0 w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Search size={12} className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-175">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Trx ID</th>
                <th className="text-left px-5 py-3 font-medium">Investment Trx</th>
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-right px-5 py-3 font-medium">ROI Amount</th>
                <th className="text-center px-5 py-3 font-medium">Rate</th>
                <th className="text-left px-5 py-3 font-medium">Credited At</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slice.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">Data not found</td></tr>
              ) : slice.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-500">{r.trxId}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{r.investmentTrxId}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800 text-sm">{r.fullName}</p>
                    <p className="text-xs text-indigo-500">@{r.username}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">
                    ${r.amount.toFixed(2)} USD
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      {r.roiRate}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{fmt(r.creditedAt)}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border ${r.status === "credited" ? "text-green-600 bg-green-50 border-green-500" : "text-yellow-600 bg-yellow-50 border-yellow-400"}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} totalResults={filtered.length} perPage={PER_PAGE} onPageChange={setPage} />
      </div>
    </div>
  );
}
