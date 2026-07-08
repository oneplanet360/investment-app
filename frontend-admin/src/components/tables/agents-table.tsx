import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search,} from "lucide-react";
import Pagination from "../common/pagination";
import { users, type User } from "../../lib/data";



const PER_PAGE = 20;

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
  filter: (u: User) => boolean;
  extraAction?: (u: User) => React.ReactNode;
};

export default function AgentsTable({ title, filter, extraAction }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const base = users.filter(filter);
    const q = query.toLowerCase().trim();
    if (!q) return base;
    return base.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
    );
  }, [filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">{title}</h1>
          <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus-within:border-indigo-400 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Username / Email"
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
                <th className="text-left px-5 py-3 font-medium">Agent</th>
                <th className="text-left px-5 py-3 font-medium">Email-Mobile</th>
                <th className="text-center px-4 py-3 font-medium">Country</th>
                <th className="text-left px-5 py-3 font-medium">Joined At</th>
                <th className="text-right px-5 py-3 font-medium">Balance</th>
                <th className="text-center px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                    Data not found
                  </td>
                </tr>
              ) : (
                slice.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-indigo-500">@{user.username}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 space-y-0.5">
                      <p>[Email is protected for the demo]</p>
                      <p>[Mobile is protected for the demo]</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {user.countryCode || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      <p>{fmtDate(user.joinedAt)}</p>
                      <p className="text-gray-400">{timeAgo(user.joinedAt)}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-gray-700">
                      ${user.balance.toFixed(2)} USD
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/agents/${user.username}`}
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
          totalResults={filtered.length}
          perPage={PER_PAGE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}