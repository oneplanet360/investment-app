import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAdminInvestmentDetail } from "../../../services/admin/adminInvestments/adminInvestments.query";
import { useUpdateInvestmentStatusMutation } from "../../../services/admin/adminInvestments/adminInvestments.mutation";

const invStatusStyle: Record<string, string> = {
  PENDING: "border border-yellow-400 text-yellow-600 bg-yellow-50",
  ACTIVE: "border border-indigo-400 text-indigo-600 bg-indigo-50",
  COMPLETED: "border border-green-500 text-green-600 bg-green-50",
  CLOSE_REQUEST: "border border-orange-400 text-orange-600 bg-orange-50",
  CLOSED: "border border-gray-400 text-gray-500 bg-gray-50",
  REJECTED: "border border-red-400 text-red-600 bg-red-50",
};

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

export default function InvestmentDetail() {
  const { trxId } = useParams<{ trxId: string }>();
  const { data, isLoading } = useAdminInvestmentDetail(trxId || "");
  const { mutate: updateStatus, isPending } = useUpdateInvestmentStatusMutation(
    trxId || "",
  );
  const inv = data?.data;
  const [mode, setMode] = useState("auto");

  if (isLoading) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!inv) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Investment not found.</p>
        <Link
          to="/admin/investments"
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to Investments
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">
        Investment Details
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            User & Investment Info
          </h2>
          <div className="divide-y divide-gray-50 text-sm">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-mono font-semibold text-gray-800 text-xs">
                {inv.trxId}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Status</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${invStatusStyle[inv.status]}`}
              >
                {inv.status}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Full Name</span>
              <span className="font-semibold text-gray-800">
                {inv.userId?.firstName || inv.userId?.lastName
                  ? `${inv.userId?.firstName} ${inv.userId?.lastName}`
                  : inv.userId?.name}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Username</span>
              <span className="text-indigo-500 font-medium">
                @{inv.userId?.username}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-indigo-500 font-medium">Email</span>
              <span className="font-semibold text-gray-800">
                {inv.userId?.email || "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Contribution Details
          </h2>
          <div className="divide-y divide-gray-50 text-sm">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Initial Deposit</span>
              <span className="font-semibold text-gray-800">
                $
                {(inv.amount || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                USD
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Recurring Contribution</span>
              <span className="font-semibold text-gray-800">
                $
                {inv.contributionAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                USD
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Contribution Frequency</span>
              <span className="font-semibold text-indigo-600">
                {inv.contributionFrequency}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Next Contribution Date</span>
              <span className="font-semibold text-gray-800 text-xs">
                {fmt(inv.nextRoiDate || inv.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Years to Grow</span>
              <span className="font-semibold text-gray-800">1 years</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Returns & Growth
          </h2>
          <div className="divide-y divide-gray-50 text-sm">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Annual Return Rate</span>
              <span className="font-semibold text-indigo-600">8.0%</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Total Return Amount</span>
              <span className="font-semibold text-gray-800">
                $
                {inv.totalReturn.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                USD
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Start Date</span>
              <span className="font-semibold text-gray-800 text-xs">
                {fmt(inv.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">End Date</span>
              <span className="font-semibold text-gray-800 text-xs">-</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Total Paid Contributions</span>
              <span className="font-semibold text-gray-800">
                12{" "}
                <span className="text-gray-400 font-normal text-xs">
                  (Out of 12)
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {inv.status === "CLOSE_REQUEST" && (
        <div className="bg-white rounded-lg shadow-sm p-5 flex flex-wrap gap-3">
          <button
            disabled={isPending}
            onClick={() => updateStatus({ status: "CLOSED" })}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded transition-colors disabled:opacity-50"
          >
            Approve Close Request
          </button>
        </div>
      )}

      {inv.status === "PENDING" && (
        <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              disabled={isPending}
              onClick={() => updateStatus({ status: "ACTIVE" })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded transition-colors disabled:opacity-50"
            >
              Approve Investment
            </button>
            <button
              disabled={isPending}
              onClick={() => updateStatus({ status: "REJECTED" })}
              className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-sm font-medium px-5 py-2 rounded transition-colors disabled:opacity-50"
            >
              Reject Investment
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Mode:</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-indigo-400 bg-transparent cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          {mode === "manual" && (
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer border border-gray-200 rounded px-4 py-2 hover:bg-gray-50 transition-colors">
                <input type="radio" name="manualPaymentMethod" value="card" className="cursor-pointer accent-indigo-600" />
                Card
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer border border-gray-200 rounded px-4 py-2 hover:bg-gray-50 transition-colors">
                <input type="radio" name="manualPaymentMethod" value="upi" className="cursor-pointer accent-indigo-600" />
                UPI
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer border border-gray-200 rounded px-4 py-2 hover:bg-gray-50 transition-colors">
                <input type="radio" name="manualPaymentMethod" value="bank_transfer" className="cursor-pointer accent-indigo-600" />
                Bank Transfer
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
