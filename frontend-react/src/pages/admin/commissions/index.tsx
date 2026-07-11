import { useState } from "react";
import { Search } from "lucide-react";
import Pagination from "../../../components/common/pagination";
import { useAdminCommissionLogs } from "../../../services/admin/adminCommissions/adminCommissions.query";

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

const levelColors: Record<number, string> = {
  1: "text-indigo-600 bg-indigo-50 border-indigo-300",
  2: "text-violet-600 bg-violet-50 border-violet-300",
  3: "text-sky-600 bg-sky-50 border-sky-300",
  4: "text-teal-600 bg-teal-50 border-teal-300",
};

export default function CommissionsLog() {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useAdminCommissionLogs(
    page,
    PER_PAGE,
    query,
    levelFilter,
  );

  const data = response?.data || [];
  const meta = response?.meta || {
    total: 0,
    page: 1,
    limit: PER_PAGE,
    totalPages: 1,
    stats: { totalPaid: 0, levelTotals: { 1: 0, 2: 0, 3: 0, 4: 0 } },
  };
  const stats = meta.stats || {
    totalPaid: 0,
    levelTotals: { 1: 0, 2: 0, 3: 0, 4: 0 },
  };

  return (
    <div className="min-h-full bg-(--theme-bg) p-4 sm:p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {([1, 2, 3, 4] as const).map((lvl) => {
          return (
            <div key={lvl} className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-xs text-gray-500">Level {lvl} Commissions</p>
              <p className="text-xl font-bold mt-1 text-indigo-600">
                ${(stats.levelTotals[lvl] || 0).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h1 className="text-base font-semibold text-gray-700">
              Commission Log
            </h1>
            <p className="text-xs text-gray-400">
              Total paid:{" "}
              <strong className="text-emerald-600">
                ${stats.totalPaid.toFixed(2)}
              </strong>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-600 outline-none focus:border-indigo-400"
            >
              <option value="all">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
            </select>
            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-52 focus-within:border-indigo-400 transition-colors">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Agent / Investor"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
              />
              <Search size={12} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-200">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Trx ID</th>
                <th className="text-left px-5 py-3 font-medium">Agent</th>
                <th className="text-left px-5 py-3 font-medium">
                  From Investor
                </th>
                <th className="text-left px-5 py-3 font-medium">
                  Investment Trx
                </th>
                <th className="text-center px-5 py-3 font-medium">Level</th>
                <th className="text-center px-5 py-3 font-medium">Rate</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Credited At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    Data not found
                  </td>
                </tr>
              ) : (
                data.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-500">
                      {c.trxId}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-sm">
                        {c.agentId?.firstName || c.agentId?.lastName
                          ? `${c.agentId?.firstName} ${c.agentId?.lastName}`
                          : c.agentId?.name}
                      </p>
                      <p className="text-xs text-indigo-500">
                        @{c.agentId?.username}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      @{c.investorId?.username}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                      {c.investmentId?.trxId}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${levelColors[c.level] || levelColors[4]}`}
                      >
                        L{c.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs font-medium text-gray-600">
                      {c.rate}%
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">
                      ${c.amount.toFixed(2)} USD
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {fmt(c.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalResults={meta.total}
          perPage={PER_PAGE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
