import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Pagination from "./pagination";
import { deposits, type Deposit } from "../../lib/data";

const PER_PAGE = 20;

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).replace(",", "");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (years >= 1)  return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks >= 1)  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days >= 1)   return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours >= 1)  return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${mins} min ago`;
}

type Props = {
  title: string;
  filter: (d: Deposit) => boolean;
  showSummary?: boolean;
};

const statusStyle: Record<string, string> = {
  pending:    "text-yellow-600 bg-yellow-50 border-yellow-400",
  approved:   "text-green-600 bg-green-50 border-green-500",
  successful: "text-blue-600 bg-blue-50 border-blue-500",
  rejected:   "text-red-500 bg-red-50 border-red-400",
  initiated:  "text-gray-500 bg-gray-50 border-gray-400",
};

export default function DepositTable({ title, filter }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const base = deposits.filter(filter);
    const q = query.toLowerCase().trim();
    if (!q) return base;
    return base.filter(
      (d) =>
        d.username.toLowerCase().includes(q) ||
        d.trxId.toLowerCase().includes(q) ||
        d.fullName.toLowerCase().includes(q)
    );
  }, [filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6 space-y-4">
      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">{title}</h1>
          <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus-within:border-indigo-400 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="TrxID / Username"
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
            />
            <button className="shrink-0 w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Search size={12} className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-200">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Gateway | Trx</th>
                <th className="text-left px-5 py-3 font-medium">Initiated</th>
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Conversion</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-center px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                    Data not found
                  </td>
                </tr>
              ) : (
                slice.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-sm">{d.gateway}</p>
                      <p className="text-xs font-mono text-indigo-500">{d.trxId}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      <p>{fmtDate(d.initiatedAt)}</p>
                      <p className="text-gray-400">{timeAgo(d.initiatedAt)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-sm">{d.fullName}</p>
                      <p className="text-xs text-indigo-500">@{d.username}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm">
                      <p className="font-semibold text-gray-700">${d.amount.toFixed(2)}</p>
                      <p className="text-xs text-orange-500">+ ${d.charge.toFixed(2)}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      <p>1 USD = {d.conversionRate} {d.conversionCurrency}</p>
                      <p className="font-semibold text-gray-800">{d.convertedAmount.toFixed(2)} {d.conversionCurrency}</p>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border ${statusStyle[d.status] || ""}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        to={`/deposits/detail/${d.trxId}`}
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
