import { Briefcase, ArrowDownToLine, Hand, CheckCircle } from "lucide-react";
import { investments } from "../../lib/data";

const totalInvestments = investments.length;
const totalContributions = investments.reduce((s, i) => s + i.contributionAmount * i.totalPaidContributions, 0);
const closeRequests = investments.filter((i) => i.closeRequestedAt).length;
const completedInvestments = investments.filter((i) => i.status === "completed").length;

type StatCard = { label: string; value: string | number; icon: React.ReactNode; bg: string };

function StatCard({ label, value, icon, bg }: StatCard) {
  return (
    <div className={`rounded-lg p-5 flex items-center justify-between ${bg}`}>
      <div>
        <p className="text-xs text-white/80 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  );
}

export default function InvestmentReport() {
  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">Investment Report</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Investments" value={totalInvestments}
          bg="bg-indigo-700" icon={<Briefcase size={22} className="text-white" />} />
        <StatCard
          label="Total Contributions"
          value={`$${totalContributions.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`}
          bg="bg-purple-700" icon={<ArrowDownToLine size={22} className="text-white" />} />
        <StatCard label="Investment Close Requests" value={closeRequests}
          bg="bg-red-700" icon={<Hand size={22} className="text-white" />} />
        <StatCard label="Completed Investments" value={completedInvestments}
          bg="bg-indigo-500" icon={<CheckCircle size={22} className="text-white" />} />
      </div>
    </div>
  );
}