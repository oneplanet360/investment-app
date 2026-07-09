import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Pagination from "../common/pagination";
import type { IInvestor } from "../../services/adminInvestors/adminInvestors.types";

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

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).replace(",", "");
}

type Props = {
  title: string;
  data: IInvestor[];
  totalPages: number;
  currentPage: number;
  totalResults: number;
  perPage: number;
  searchQuery: string;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  isLoading?: boolean;
  extraAction?: (u: IInvestor) => React.ReactNode;
};

export default function InvestorsTable({ 
  title, 
  data,
  totalPages,
  currentPage,
  totalResults,
  perPage,
  searchQuery,
  onPageChange,
  onSearchChange,
  isLoading,
  extraAction 
}: Props) {
  return (
    <div className="min-h-full bg-(--theme-bg) p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">{title}</h1>
          <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus-within:border-indigo-400 transition-colors">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Username / Email"
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
          <table className="w-full text-sm min-w-175">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Investor</th>
                <th className="text-left px-5 py-3 font-medium">Email-Mobile</th>
                <th className="text-center px-4 py-3 font-medium">Country</th>
                <th className="text-left px-5 py-3 font-medium">Joined At</th>
                <th className="text-right px-5 py-3 font-medium">Balance</th>
                <th className="text-center px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                    {isLoading ? "Fetching data..." : "Data not found"}
                  </td>
                </tr>
              ) : (
                data.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-indigo-500">@{user.username}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 space-y-0.5">
                      <p>{user.email}</p>
                      <p>{user.mobile || "[Not provided]"}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {user.country || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      <p>{fmtDate(user.createdAt)}</p>
                      <p className="text-gray-400">{timeAgo(user.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-gray-700">
                      $0.00 USD
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/investors/${user.username}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 border border-indigo-300 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors"
                        >
                          Details
                        </Link>
                        {extraAction?.(user)}
                      </div>
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