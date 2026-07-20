import { useAgentCommissionsQuery } from "../../../services/client/clientAgent/clientAgent.queries";

export default function Commissions() {
  const { data: commissions = [], isLoading } = useAgentCommissionsQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Commissions</h2>
          <p className="text-sm text-client-text-secondary mt-1">
            View your earned commissions from downline investments.
          </p>
        </div>
      </div>

      <div className="bg-client-card border border-client-border rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-client-text-secondary">
          <thead className="text-xs uppercase bg-client-card text-client-text-secondary border-b border-client-border">
            <tr>
              <th className="px-4 py-3 font-medium">Trx ID</th>
              <th className="px-4 py-3 font-medium">Investor</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-client-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-client-text-secondary">
                  Loading commissions...
                </td>
              </tr>
            ) : commissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-client-text-secondary">
                  No commissions found.
                </td>
              </tr>
            ) : (
              commissions.map((comm: any) => (
                <tr key={comm._id} className="hover:bg-client-card transition-colors">
                  <td className="px-4 py-3 font-medium text-client-text">{comm.trxId}</td>
                  <td className="px-4 py-3">{comm.investorId?.username || 'Unknown'}</td>
                  <td className="px-4 py-3">Level {comm.level} ({comm.rate}%)</td>
                  <td className="px-4 py-3 font-medium text-brand-primary">+Rs.{comm.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-[10px] font-semibold tracking-wide rounded-md bg-client-success/10 text-brand-primary">
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
