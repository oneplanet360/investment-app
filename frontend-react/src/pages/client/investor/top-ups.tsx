import { Plus } from "lucide-react";
import { useClientDepositsQuery } from "../../../services/client/clientDeposits/clientDeposits.query";

export default function TopUps() {
  const { data, isLoading } = useClientDepositsQuery();
  const deposits = data?.data || [];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Top-ups</h2>
          <p className="text-sm text-zinc-400 mt-1">
            View your account top-ups and deposits.
          </p>
        </div>
        <button className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl text-xs font-semibold text-white flex items-center gap-2">
          <Plus size={16} />
          New Top-up
        </button>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-[#1a1a1a] text-zinc-500 border-b border-[#222]">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Gateway</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Loading top-ups...
                </td>
              </tr>
            ) : deposits.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  No top-ups found.
                </td>
              </tr>
            ) : (
              deposits.map((deposit: any) => (
                <tr key={deposit._id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{deposit.trxId}</td>
                  <td className="px-4 py-3 text-white">${deposit.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{deposit.gateway}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-[10px] font-semibold tracking-wide rounded-md bg-emerald-500/10 text-emerald-400">
                      {deposit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(deposit.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
