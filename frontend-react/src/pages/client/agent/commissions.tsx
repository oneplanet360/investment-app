import { useAgentCommissionsQuery } from "../../../services/client/clientAgent/clientAgent.queries";

export default function Commissions() {
  const { data: commissions = [], isLoading } = useAgentCommissionsQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Commissions</h2>
          <p className="text-sm text-zinc-400 mt-1">
            View your earned commissions from downline investments.
          </p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-[#1a1a1a] text-zinc-500 border-b border-[#222]">
            <tr>
              <th className="px-4 py-3 font-medium">Trx ID</th>
              <th className="px-4 py-3 font-medium">Investor</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Loading commissions...
                </td>
              </tr>
            ) : commissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No commissions found.
                </td>
              </tr>
            ) : (
              commissions.map((comm: any) => (
                <tr key={comm._id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{comm.trxId}</td>
                  <td className="px-4 py-3">{comm.investorId?.username || 'Unknown'}</td>
                  <td className="px-4 py-3">Level {comm.level} ({comm.rate}%)</td>
                  <td className="px-4 py-3 font-medium text-emerald-400">+${comm.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-[10px] font-semibold tracking-wide rounded-md bg-emerald-500/10 text-emerald-400">
                      {comm.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(comm.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
