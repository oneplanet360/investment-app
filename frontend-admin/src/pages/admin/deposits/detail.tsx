import { useParams, Link } from "react-router-dom";
import { deposits, type DepositStatus } from "../../../lib/data";

const statusStyle: Record<DepositStatus, string> = {
  pending:    "border border-yellow-400 text-yellow-600 bg-yellow-50",
  approved:   "border border-green-500 text-green-600 bg-green-50",
  successful: "border border-blue-500 text-blue-600 bg-blue-50",
  rejected:   "border border-red-400 text-red-500 bg-red-50",
  initiated:  "border border-gray-400 text-gray-500 bg-gray-50",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).replace(",", "");
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

export default function DepositDetail() {
  const { trxId } = useParams<{ trxId: string }>();
  const dep = deposits.find((d) => d.trxId === trxId);

  if (!dep) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Deposit not found.</p>
        <Link to="/deposits/all" className="text-sm text-indigo-600 hover:underline">
          ← Back to Deposits
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-base font-semibold text-gray-700">Deposit Details</h1>
        <Link
          to="/deposits/all"
          className="text-sm text-indigo-600 border border-indigo-300 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors"
        >
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Transaction Info</h2>
          <Row label="Transaction ID" value={<span className="font-mono text-xs tracking-wide">{dep.trxId}</span>} />
          <Row label="Gateway" value={<span className="text-indigo-600 font-medium">{dep.gateway}</span>} />
          <Row label="Initiated At" value={fmtDate(dep.initiatedAt)} />
          <Row
            label="Status"
            value={
              <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${statusStyle[dep.status]}`}>
                {dep.status}
              </span>
            }
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">User Info</h2>
          <Row label="Full Name" value={<span className="font-semibold">{dep.fullName}</span>} />
          <Row label="Username" value={<span className="text-indigo-500">@{dep.username}</span>} />
          <Row label="Email" value={<span className="text-gray-400 text-xs">[Email is protected for the demo]</span>} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Amount Details</h2>
          <Row
            label="Amount"
            value={`$${dep.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`}
          />
          <Row
            label="Charge"
            value={<span className="text-orange-500 font-semibold">${dep.charge.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</span>}
          />
          <Row
            label="Total Amount"
            value={<span className="font-bold text-gray-900">${dep.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</span>}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Conversion Details</h2>
          <Row label="Rate" value={`$1.00 USD = 1.00 ${dep.conversionCurrency}`} />
          <Row
            label="Converted Amount"
            value={`${dep.convertedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${dep.conversionCurrency}`}
          />
          <Row label="Currency" value={dep.conversionCurrency} />
        </div>
      </div>

      {dep.status === "pending" && (
        <div className="bg-white rounded-lg shadow-sm p-5 flex flex-wrap gap-3">
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded transition-colors">
            Approve
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded transition-colors">
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
