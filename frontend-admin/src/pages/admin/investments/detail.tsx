import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Search } from "lucide-react";
import { investments } from "../../lib/data";
import Pagination from "../../components/common/pagination";

const PER_PAGE = 10;

type Contribution = {
  id: string;
  trxId: string;
  amount: number;
  penalty: number;
  status: "completed" | "pending" | "rejected";
  contributedAt: string;
};

function buildContributions(inv: (typeof investments)[0]): Contribution[] {
  if (inv.totalPaidContributions === 0) return [];
  return Array.from({ length: inv.totalPaidContributions }, (_, i) => {
    const d = new Date(inv.startDate);
    d.setDate(d.getDate() + i + 1);
    return {
      id: String(i + 1),
      trxId: `CTX${inv.trxId.slice(0, 6)}${String(i + 1).padStart(3, "0")}`,
      amount: inv.contributionAmount,
      penalty: 0,
      status: "completed" as const,
      contributedAt: d.toISOString(),
    };
  });
}

const statusStyle: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const invStatusStyle: Record<string, string> = {
  active: "border border-indigo-400 text-indigo-600",
  completed: "border border-green-500 text-green-600",
  closed: "border border-gray-400 text-gray-500",
};

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(",", "");
}

export default function InvestmentDetail() {
  const { trxId } = useParams<{ trxId: string }>();
  const inv = investments.find((i) => i.trxId === trxId);

  const [cTrxQuery, setCTrxQuery] = useState("");
  const [page, setPage] = useState(1);

  if (!inv) {
    return (
      <div className="min-h-full bg-[#f0f2f8] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Investment not found.</p>
        <Link to="/investments/all" className="text-sm text-indigo-600 hover:underline">
          ← Back to Investments
        </Link>
      </div>
    );
  }

  const allContributions = buildContributions(inv);
  const filteredContributions = cTrxQuery.trim()
    ? allContributions.filter((c) => c.trxId.toLowerCase().includes(cTrxQuery.toLowerCase()))
    : allContributions;

  const totalPages = Math.max(1, Math.ceil(filteredContributions.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filteredContributions.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">Investment Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">User & Investment Info</h2>
          <div className="divide-y divide-gray-50 text-sm">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-mono font-semibold text-gray-800 text-xs">{inv.trxId}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Status</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${invStatusStyle[inv.status]}`}>
                {inv.status}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Full Name</span>
              <span className="font-semibold text-gray-800">{inv.fullName}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Username</span>
              <span className="text-indigo-500 font-medium">@{inv.username}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-indigo-500 font-medium">Email</span>
              <span className="text-gray-400 text-xs">[Email is protected for the demo]</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Contribution Details</h2>
          <div className="divide-y divide-gray-50 text-sm">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Initial Deposit</span>
              <span className="font-semibold text-gray-800">
                ${inv.initialDeposit.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Recurring Contribution</span>
              <span className="font-semibold text-gray-800">
                ${inv.contributionAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Contribution Frequency</span>
              <span className="font-semibold text-indigo-600">{inv.contributionFrequency}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Next Contribution Date</span>
              <span className="font-semibold text-gray-800 text-xs">{fmt(inv.nextContributionDate)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Years to Grow</span>
              <span className="font-semibold text-gray-800">{inv.yearsToGrow} years</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Returns & Growth</h2>
          <div className="divide-y divide-gray-50 text-sm">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Annual Return Rate</span>
              <span className="font-semibold text-indigo-600">{inv.annualReturnRate}%</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Total Return Amount</span>
              <span className="font-semibold text-gray-800">
                ${inv.totalReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Start Date</span>
              <span className="font-semibold text-gray-800 text-xs">{fmt(inv.startDate)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">End Date</span>
              <span className="font-semibold text-gray-800 text-xs">{fmt(inv.endDate)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Total Paid Contributions</span>
              <span className="font-semibold text-gray-800">
                {inv.totalPaidContributions}{" "}
                <span className="text-gray-400 font-normal text-xs">(Out of {inv.totalContributionSlots})</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">All Contributions</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-48 focus-within:border-indigo-400 transition-colors">
              <input
                type="text"
                value={cTrxQuery}
                onChange={(e) => { setCTrxQuery(e.target.value); setPage(1); }}
                placeholder="Transaction Id"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
              />
              <button className="shrink-0 w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <Search size={12} className="text-white" />
              </button>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full sm:w-44 focus-within:border-indigo-400 transition-colors">
              <input
                type="text"
                placeholder="Start Date – End Date"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
              />
              <button className="shrink-0 w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <Search size={12} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-5 py-3 font-medium">Transaction ID</th>
                <th className="text-right px-4 py-3 font-medium">Contribution Amount</th>
                <th className="text-right px-4 py-3 font-medium">Penalty Amount</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Contributed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                    Data not found
                  </td>
                </tr>
              ) : (
                slice.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-800 tracking-wide">
                      {c.trxId}
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm font-medium text-gray-700">
                      ${c.amount.toFixed(2)} USD
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm text-gray-600">
                      ${c.penalty.toFixed(2)} USD
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${statusStyle[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {fmt(c.contributedAt)}
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
          totalResults={filteredContributions.length}
          perPage={PER_PAGE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
