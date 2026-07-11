import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { topUps } from "../../../lib/data";

const statusStyle: Record<string, string> = {
  completed: "text-green-600 bg-green-50 border-green-500",
  pending: "text-yellow-600 bg-yellow-50 border-yellow-400",
  rejected: "text-red-500 bg-red-50 border-red-400",
};

function fmt(d: string) {
  return new Date(d)
    .toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

export default function TopUpDetail() {
  const { trxId } = useParams<{ trxId: string }>();
  const topUp = topUps.find((t) => t.trxId === trxId);

  if (!topUp) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Top-up not found.</p>
        <Link to="/topups" className="text-sm text-indigo-600 hover:underline">
          ← Back to Top-ups
        </Link>
      </div>
    );
  }

  const rows: [string, React.ReactNode][] = [
    [
      "Transaction ID",
      <span className="font-mono font-semibold text-xs">{topUp.trxId}</span>,
    ],
    [
      "Status",
      <span
        className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border ${statusStyle[topUp.status]}`}
      >
        {topUp.status}
      </span>,
    ],
    ["Full Name", topUp.fullName],
    ["Username", <span className="text-indigo-500">@{topUp.username}</span>],
    [
      "Investment Trx ID",
      <span className="font-mono text-xs text-gray-600">
        {topUp.investmentTrxId}
      </span>,
    ],
    [
      "Top-up Amount",
      <span className="font-semibold text-gray-800">
        ${topUp.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
        USD
      </span>,
    ],
    ["ROI Cycle Start", fmt(topUp.roiCycleStart)],
    ["Created At", fmt(topUp.createdAt)],
  ];

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/topups"
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 className="text-base font-semibold text-gray-700">Top-up Detail</h1>
      </div>

      <div className="max-w-xl bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Top-up Information
        </h2>
        <div className="divide-y divide-gray-50 text-sm">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between py-2.5 gap-2"
            >
              <span className="text-gray-500 shrink-0">{label}</span>
              <span className="font-medium text-gray-800 text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
