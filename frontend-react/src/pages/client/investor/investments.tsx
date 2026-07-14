import { TrendingUp, XCircle } from "lucide-react";
import { useClientInvestmentsQuery, useCloseInvestmentMutation } from "../../../services/client/clientInvestments/clientInvestments.query";

export default function Investments() {
  const { data, isLoading } = useClientInvestmentsQuery();
  const { mutate: closeInvestment, isPending } = useCloseInvestmentMutation();

  const investments = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Investments</h2>
          <p className="text-sm text-zinc-400 mt-1">
            View your active and completed investment packages.
          </p>
        </div>
        <button className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl text-xs font-semibold text-white flex items-center gap-2">
          <TrendingUp size={16} />
          Invest Now
        </button>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-[#1a1a1a] text-zinc-500 border-b border-[#222]">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Next ROI</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Loading investments...
                </td>
              </tr>
            ) : investments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No investments found.
                </td>
              </tr>
            ) : (
              investments.map((inv: any) => (
                <tr key={inv._id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{inv.trxId}</td>
                  <td className="px-4 py-3 text-white">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{inv.type}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-[10px] font-semibold tracking-wide rounded-md bg-emerald-500/10 text-emerald-400">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(inv.nextRoiDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {inv.status === 'ACTIVE' && (
                      <button 
                        onClick={() => closeInvestment({ trxId: inv.trxId })}
                        disabled={isPending}
                        className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1 text-xs"
                      >
                        <XCircle size={14} /> Close
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
