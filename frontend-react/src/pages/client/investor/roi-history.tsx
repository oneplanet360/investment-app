import { useClientRoiQuery } from "../../../services/client/clientRoi/clientRoi.query";

export default function RoiHistory() {
  const { data, isLoading } = useClientRoiQuery();
  const logs = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ROI History</h2>
          <p className="text-sm text-zinc-400 mt-1">
            View your returns on investments.
          </p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-[#1a1a1a] text-zinc-500 border-b border-[#222]">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Investment ID</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Month Index</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Loading history...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  No ROI history found.
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr
                  key={log._id}
                  className="hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {log.trxId}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {log.investmentId?.trxId}
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-400">
                    ${log.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">{log.monthIndex}</td>
                  <td className="px-4 py-3">
                    {new Date(log.createdAt).toLocaleDateString()}
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
