import { useState, useMemo } from "react";
import { Trash2, Send } from "lucide-react";
import { subscribers as initialSubscribers } from "../../lib/data";
import Pagination from "../../components/common/pagination";

const PER_PAGE = 20;

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

export default function Subscribers() {
  const [list, setList] = useState(initialSubscribers);
  const [page, setPage] = useState(1);

  const remove = (id: string) =>
    setList((prev) => prev.filter((s) => s.id !== id));

  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = useMemo(
    () => list.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
    [list, currentPage],
  );

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">Subscribers</h1>
          <button className="flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-400 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors">
            <Send size={13} />
            Send Email
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-center px-4 py-3 font-medium">
                  Subscribe At
                </th>
                <th className="text-center px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                slice.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-700">
                      {sub.email}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`text-sm ${new Date(sub.subscribedAt).getFullYear() >= 2026 ? "text-indigo-500" : "text-gray-600"}`}
                      >
                        {fmtDate(sub.subscribedAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => remove(sub.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 border border-red-300 rounded px-3 py-1.5 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
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
          totalResults={list.length}
          perPage={PER_PAGE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
