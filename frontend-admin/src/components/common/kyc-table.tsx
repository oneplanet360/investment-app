import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Pagination from "./pagination";
import { kycSubmissions, type KycSubmission, type KycStatus } from "../../lib/data";

const PER_PAGE = 20;

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).replace(",", "");
}

const statusStyle: Record<KycStatus, string> = {
  pending:  "text-yellow-600 bg-yellow-50 border-yellow-400",
  approved: "text-green-600 bg-green-50 border-green-500",
  rejected: "text-red-500 bg-red-50 border-red-400",
};

type Props = {
  title: string;
  filter: (k: KycSubmission) => boolean;
};

export default function KycTable({ title, filter }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const base = kycSubmissions.filter(filter);
    const q = query.toLowerCase().trim();
    if (!q) return base;
    return base.filter(
      (k) =>
        k.username.toLowerCase().includes(q) ||
        k.fullName.toLowerCase().includes(q) ||
        k.docNumber.toLowerCase().includes(q)
    );
  }, [filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6 space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">{title}</h1>
          <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-64 focus-within:border-indigo-400 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Username / Doc No."
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
            />
            <button className="shrink-0 w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Search size={12} className="text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-187.5">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-left px-5 py-3 font-medium">Document</th>
                <th className="text-left px-5 py-3 font-medium">Country</th>
                <th className="text-left px-5 py-3 font-medium">Submitted</th>
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
                slice.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-sm">{k.fullName}</p>
                      <p className="text-xs text-indigo-500">@{k.username}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${k.userType === "agent" ? "text-violet-600 bg-violet-50 border-violet-400" : "text-sky-600 bg-sky-50 border-sky-400"}`}>
                        {k.userType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-700">{k.docType}</p>
                      <p className="text-xs font-mono text-gray-400">{k.docNumber}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{k.country}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {fmtDate(k.submittedAt)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border ${statusStyle[k.status]}`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        to={`/kyc/detail/${k.id}`}
                        className="inline-flex items-center text-xs font-medium text-indigo-600 border border-indigo-300 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors"
                      >
                        Review
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
