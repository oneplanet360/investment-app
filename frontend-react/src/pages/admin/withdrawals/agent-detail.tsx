import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useAdminWithdrawalDetail } from "../../../services/admin/adminWithdrawals/adminWithdrawals.query";
import { useUpdateWithdrawalStatusMutation } from "../../../services/admin/adminWithdrawals/adminWithdrawals.mutation";

const statusStyle: Record<string, string> = {
  PENDING:  "text-yellow-600 bg-yellow-50 border-yellow-400",
  APPROVED: "text-green-600 bg-green-50 border-green-500",
  REJECTED: "text-red-500 bg-red-50 border-red-400",
};

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).replace(",", "");
}

export default function AgentWithdrawalDetail() {
  const { trxId } = useParams<{ trxId: string }>();
  const { data, isLoading } = useAdminWithdrawalDetail(trxId || "");
  const { mutate: updateStatus, isPending } = useUpdateWithdrawalStatusMutation(trxId || "");

  const withdrawal = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Withdrawal not found.</p>
        <Link to="/withdrawals/agent" className="text-sm text-indigo-600 hover:underline">← Back to Agent Withdrawals</Link>
      </div>
    );
  }

  const handleApprove = () => {
    updateStatus({ status: "APPROVED" });
  };

  const handleReject = () => {
    updateStatus({ status: "REJECTED" });
  };

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/withdrawals/agent" className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 className="text-base font-semibold text-gray-700">Agent Withdrawal Request</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Detail Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Request Details</h2>
          <div className="divide-y divide-gray-50 text-sm">
            {[
              ["Trx ID", <span className="font-mono text-indigo-500 font-semibold text-xs">{withdrawal.trxId}</span>],
              ["Agent Name", withdrawal.userId?.firstName || withdrawal.userId?.lastName ? `${withdrawal.userId?.firstName} ${withdrawal.userId?.lastName}` : withdrawal.userId?.name],
              ["Agent Username", `@${withdrawal.userId?.username}`],
              ["Email", withdrawal.userId?.email || "-"],
              ["Requested Amount", `$${withdrawal.amount.toFixed(2)}`],
              ["Charge", <span className="text-orange-500">-${withdrawal.charge?.toFixed(2) || 0}</span>],
              ["Net Payable", <span className="font-semibold text-emerald-600">${(withdrawal.amount - (withdrawal.charge || 0)).toFixed(2)}</span>],
              ["Payment Method", withdrawal.gateway],
              ["Requested At", fmt(withdrawal.createdAt)],
              ...(withdrawal.updatedAt && withdrawal.status !== 'PENDING' ? [["Reviewed At", fmt(withdrawal.updatedAt)]] : []),
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between py-2.5 gap-2">
                <span className="text-gray-500 shrink-0">{label}</span>
                <span className="font-medium text-gray-800 text-right">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Status</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border ${statusStyle[withdrawal.status]}`}>
                {withdrawal.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Card */}
        {withdrawal.status === "PENDING" && (
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Action Required</h2>
            <p className="text-sm text-gray-500">
              Please review this commission withdrawal request.
              Upon approval, the net amount of <strong>${(withdrawal.amount - (withdrawal.charge || 0)).toFixed(2)}</strong> should be paid out via <strong>{withdrawal.gateway}</strong>.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleApprove}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle size={16} /> Approve Withdrawal
              </button>
              <button
                onClick={handleReject}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-300 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <XCircle size={16} /> Reject Withdrawal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
