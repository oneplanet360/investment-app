import { useState } from "react";
import { Search } from "lucide-react";
import Pagination from "../../../components/common/pagination";
import { useAdminRoiLogs } from "../../../services/admin/adminRoi/adminRoi.query";
import { useUpdateAdminRoiStatus } from "../../../services/admin/adminRoi/adminRoi.mutation";

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

export default function RoiRequests() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useAdminRoiLogs(page, PER_PAGE, query, "PENDING");
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAdminRoiStatus();

  const data = response?.data || [];
  const meta = response?.meta || {
    total: 0,
    page: 1,
    limit: PER_PAGE,
    totalPages: 1,
  };

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveTrxId, setApproveTrxId] = useState<string | null>(null);
  const [approveAmount, setApproveAmount] = useState("");

  const handleApproveClick = (trxId: string) => {
    setApproveTrxId(trxId);
    setApproveAmount("");
    setIsApproveModalOpen(true);
  };

  const submitApprove = () => {
    const amount = Number(approveAmount);
    if (isNaN(amount) || amount < 0 || approveAmount.trim() === "") {
      alert("Invalid amount entered. Please enter a valid number.");
      return;
    }

    if (approveTrxId) {
      updateStatus({ trxId: approveTrxId, status: "APPROVED", amount });
    }
    setIsApproveModalOpen(false);
    setApproveTrxId(null);
  };

  const handleReject = (trxId: string) => {
    if (window.confirm("Are you sure you want to reject this ROI request?")) {
      updateStatus({ trxId, status: "REJECTED" });
    }
  };

  return (
    <div className="min-h-full bg-(--theme-bg) p-4 sm:p-6 space-y-4 relative">
      {/* Approve Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Approve ROI Request</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="roiAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  ROI Payout Amount (INR)
                </label>
                <input
                  type="number"
                  id="roiAmount"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500">
                This amount will be credited to the user's account upon approval.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitApprove}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isUpdating ? "Approving..." : "Approve & Credit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-700">
            Pending ROI Requests
          </h1>
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
          <table className="w-full text-sm min-w-200">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Trx ID</th>
                <th className="text-left px-5 py-3 font-medium">Investment Trx</th>
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-right px-5 py-3 font-medium">ROI Amount</th>
                <th className="text-center px-5 py-3 font-medium">Rate</th>
                <th className="text-left px-5 py-3 font-medium">Generated At</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-center px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    No pending ROI requests found.
                  </td>
                </tr>
              ) : (
                data.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-500">
                      {r.trxId}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                      {r.investmentId?.trxId}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 text-sm">
                        {r.investorId?.firstName || r.investorId?.lastName
                          ? `${r.investorId?.firstName} ${r.investorId?.lastName}`
                          : r.investorId?.name}
                      </p>
                      <p className="text-xs text-indigo-500">
                        @{r.investorId?.username}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">
                      ${r.amount.toFixed(2)} INR
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        {r.roiRate}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {fmt(r.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border text-yellow-600 bg-yellow-50 border-yellow-400">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleApproveClick(r.trxId)}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(r.trxId)}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
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
