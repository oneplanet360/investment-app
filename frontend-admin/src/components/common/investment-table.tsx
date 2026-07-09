import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Pagination from "./pagination";
import type { IInvestment } from "../../services/adminInvestments/adminInvestments.types";

function fmtDate(d: string) {
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
  ACTIVE:    "text-indigo-600 bg-indigo-50 border-indigo-400",
  COMPLETED: "text-green-600 bg-green-50 border-green-500",
  CLOSE_REQUEST: "text-orange-600 bg-orange-50 border-orange-400",
  CLOSED:    "text-gray-500 bg-gray-50 border-gray-400",
};

type Props = {
  title: string;
  investments: IInvestment[];
  totalPages: number;
  currentPage: number;
  totalResults: number;
  perPage: number;
  searchQuery: string;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  isLoading?: boolean;
};

export default function InvestmentTable({
  title,
  investments,
  totalPages,
  currentPage,
  totalResults,
  perPage,
  searchQuery,
  onPageChange,
  onSearchChange,
  isLoading
}: Props) {

  return (
    <div className="min-h-full bg-(--theme-bg) p-4 sm:p-6 space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">{title}</h1>
          <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus-within:border-indigo-400 transition-colors">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="TrxID / Username"
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
            />
            <button className="shrink-0 w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Search size={12} className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <span className="text-sm text-indigo-600 font-medium">Loading...</span>
            </div>
          )}
          <table className="w-full text-sm min-w-225">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Trx ID</th>
                <th className="text-left px-5 py-3 font-medium">Started</th>
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-right px-5 py-3 font-medium">Initial Deposit</th>
                <th className="text-right px-5 py-3 font-medium">Contribution</th>
                <th className="text-right px-5 py-3 font-medium">Total Return</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-center px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {investments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    {isLoading ? "Fetching data..." : "Data not found"}
                  </td>
                </tr>
              ) : (
                investments.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-500 tracking-wide">
                      {inv.trxId}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {fmtDate(inv.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-sm">
                        {inv.userId?.firstName || inv.userId?.lastName ? `${inv.userId.firstName} ${inv.userId.lastName}` : inv.userId?.name}
                      </p>
                      <p className="text-xs text-indigo-500">@{inv.userId?.username}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-gray-700">
                      ${(inv.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-gray-600">
                      <p>${inv.contributionAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{inv.contributionFrequency}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-emerald-600">
                      ${inv.totalReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border ${statusStyle[inv.status] ?? ""}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        to={`/investments/detail/${inv.trxId}`}
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
          totalResults={totalResults}
          perPage={perPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
