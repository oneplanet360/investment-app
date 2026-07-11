import { useParams, Link } from "react-router-dom";
import { useAdminWithdrawalDetail } from "../../../services/admin/adminWithdrawals/adminWithdrawals.query";
import { useUpdateWithdrawalStatusMutation } from "../../../services/admin/adminWithdrawals/adminWithdrawals.mutation";

const statusStyle: Record<string, string> = {
  PENDING: "border border-yellow-400 text-yellow-600 bg-yellow-50",
  APPROVED: "border border-green-500 text-green-600 bg-green-50",
  REJECTED: "border border-red-400 text-red-500 bg-red-50",
};

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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">
        {value}
      </span>
    </div>
  );
}

export default function WithdrawalDetail() {
  const { trxId } = useParams<{ trxId: string }>();
  const { data, isLoading } = useAdminWithdrawalDetail(trxId || "");
  const { mutate: updateStatus, isPending } = useUpdateWithdrawalStatusMutation(
    trxId || "",
  );

  const w = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!w) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Withdrawal not found.</p>
        <Link
          to="/withdrawals/all"
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to Withdrawals
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-base font-semibold text-gray-700">
          Withdrawal Details
        </h1>
        <Link
          to="/withdrawals/all"
          className="text-sm text-indigo-600 border border-indigo-300 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors"
        >
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Transaction Info
          </h2>
          <Row
            label="Transaction ID"
            value={
              <span className="font-mono text-xs tracking-wide">{w.trxId}</span>
            }
          />
          <Row
            label="Method"
            value={
              <span className="text-indigo-600 font-medium">{w.gateway}</span>
            }
          />
          <Row label="Initiated At" value={fmtDate(w.createdAt)} />
          <Row
            label="Status"
            value={
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${statusStyle[w.status]}`}
              >
                {w.status}
              </span>
            }
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            User Info
          </h2>
          <Row
            label="Full Name"
            value={
              <span className="font-semibold">
                {w.userId?.firstName || w.userId?.lastName
                  ? `${w.userId?.firstName} ${w.userId?.lastName}`
                  : w.userId?.name}
              </span>
            }
          />
          <Row
            label="Username"
            value={
              <span className="text-indigo-500">@{w.userId?.username}</span>
            }
          />
          <Row
            label="Email"
            value={
              <span className="font-semibold text-gray-800">
                {w.userId?.email || "-"}
              </span>
            }
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Amount Details
          </h2>
          <Row
            label="Amount"
            value={`$${w.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`}
          />
          <Row
            label="Charge"
            value={
              <span className="text-orange-500 font-semibold">
                $
                {w.charge.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                USD
              </span>
            }
          />
          <Row
            label="Net Amount"
            value={
              <span className="font-bold text-gray-900">
                $
                {(w.amount - (w.charge || 0)).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                USD
              </span>
            }
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Conversion Details
          </h2>
          <Row
            label="Rate"
            value={`$1.00 USD = ${w.conversionRate.toFixed(2)} ${w.conversionCurrency}`}
          />
          <Row
            label="Converted Amount"
            value={`${w.convertedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${w.conversionCurrency}`}
          />
          <Row label="Currency" value={w.conversionCurrency} />
        </div>
      </div>

      {w.status === "PENDING" && (
        <div className="bg-white rounded-lg shadow-sm p-5 flex flex-wrap gap-3">
          <button
            disabled={isPending}
            onClick={() => updateStatus({ status: "APPROVED" })}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded transition-colors disabled:opacity-50"
          >
            Approve
          </button>
          <button
            disabled={isPending}
            onClick={() => updateStatus({ status: "REJECTED" })}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
