import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Pagination from "../../../components/common/pagination";
import { topUps } from "../../../lib/data";

const PER_PAGE = 20;

function fmt(d: string) {
  return new Date(d)
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

const statusStyle: Record<string, string> = {
  completed: "text-green-600 bg-green-50 border-green-500",
  pending: "text-yellow-600 bg-yellow-50 border-yellow-400",
  rejected: "text-red-500 bg-red-50 border-red-400",
};

export default function AllTopUps() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return topUps;
    return topUps.filter(
      (t) =>
        t.username.toLowerCase().includes(q) ||
        t.trxId.toLowerCase().includes(q) ||
        t.investmentTrxId.toLowerCase().includes(q),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );
  const totalAmount = topUps
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Top-up Volume",
            value: `Rs.${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            color: "text-emerald-600",
          },
          {
            label: "Total Records",
            value: topUps.length,
            color: "text-indigo-600",
          },
          {
            label: "Completed",
            value: topUps.filter((t) => t.status === "completed").length,
            color: "text-green-600",
          },
          {
            label: "Pending",
            value: topUps.filter((t) => t.status === "pending").length,
            color: "text-yellow-600",
          },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">All Top-ups</h1>
          <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus-within:border-indigo-400 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Username / TrxID"
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
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium">
                  Investment Trx
                </th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">
                  ROI Cycle Start
                </th>
                <th className="text-left px-5 py-3 font-medium">Created At</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-center px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slice.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    Data not found
                  </td>
                </tr>
              ) : (
                slice.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-500">
                      {t.trxId}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-sm">
                        {t.fullName}
                      </p>
                      <p className="text-xs text-indigo-500">@{t.username}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                      {t.investmentTrxId}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-700">
                      Rs. {t.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      INR
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {fmt(t.roiCycleStart)}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {fmt(t.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border ${statusStyle[t.status]}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        to={`/topups/detail/${t.trxId}`}
                        className="inline-flex items-center text-xs font-medium text-indigo-600 border border-indigo-300 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={filtered.length}
          perPage={PER_PAGE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
