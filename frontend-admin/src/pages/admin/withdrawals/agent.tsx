import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Pagination from "../../../components/common/pagination";
import { agentWithdrawals } from "../../../lib/data";

const PER_PAGE = 20;

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).replace(",", "");
}

const statusStyle: Record<string, string> = {
  pending:  "text-yellow-600 bg-yellow-50 border-yellow-400",
  approved: "text-green-600 bg-green-50 border-green-500",
  rejected: "text-red-500 bg-red-50 border-red-400",
};

export default function AgentWithdrawals() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return agentWithdrawals;
    return agentWithdrawals.filter(
      (w) => w.agentUsername.toLowerCase().includes(q) || w.trxId.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Pending",  value: agentWithdrawals.filter(w => w.status === "pending").reduce((s, w) => s + w.netAmount, 0),  color: "text-yellow-600" },
          { label: "Total Approved", value: agentWithdrawals.filter(w => w.status === "approved").reduce((s, w) => s + w.netAmount, 0), color: "text-green-600" },
          { label: "Total Rejected", value: agentWithdrawals.filter(w => w.status === "rejected").reduce((s, w) => s + w.netAmount, 0), color: "text-red-500" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-xl font-bold mt-1 ${c.color}`}>${c.value.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">Agent Commission Withdrawals</h1>
          <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus-within:border-indigo-400 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Agent Username / TrxID"
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
            />
            <button className="shrink-0 w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Search size={12} className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Trx ID</th>
                <th className="text-left px-5 py-3 font-medium">Agent</th>
                <th className="text-left px-5 py-3 font-medium">Method</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-right px-5 py-3 font-medium">Charge</th>
                <th className="text-right px-5 py-3 font-medium">Net Amount</th>
                <th className="text-left px-5 py-3 font-medium">Requested At</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-center px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slice.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">Data not found</td></tr>
              ) : slice.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-500">{w.trxId}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800 text-sm">{w.agentFullName}</p>
                    <p className="text-xs text-indigo-500">@{w.agentUsername}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{w.method}</td>
                  <td className="px-5 py-3.5 text-right text-sm text-gray-700">${w.amount.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-right text-xs text-orange-500">+${w.charge.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gray-800">${w.netAmount.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{fmt(w.requestedAt)}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border ${statusStyle[w.status]}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Link
                      to={`/withdrawals/agent/detail/${w.id}`}
                      className="inline-flex items-center text-xs font-medium text-indigo-600 border border-indigo-300 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors"
                    >
                      Details
                    </Link>
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
