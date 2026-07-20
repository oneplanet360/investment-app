import { useClientRoiQuery } from "../../../services/client/clientRoi/clientRoi.query";

export default function RoiHistory() {
  const { data, isLoading } = useClientRoiQuery();
  const logs = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ROI History</h2>
          <p className="text-sm text-client-text-secondary mt-1">
            View your returns on investments.
          </p>
        </div>
      </div>

      <div className="bg-client-card border border-client-border rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-client-text-secondary">
          <thead className="text-xs uppercase bg-client-card text-client-text-secondary border-b border-client-border">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Investment ID</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Month Index</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-client-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-client-text-secondary">
                  Loading history...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-client-text-secondary">
                  No ROI history found.
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log._id} className="hover:bg-client-card transition-colors">
                  <td className="px-4 py-3 font-medium text-client-text">{log.trxId}</td>
                  <td className="px-4 py-3 text-client-text">{log.investmentId?.trxId}</td>
                  <td className="px-4 py-3 font-medium text-brand-primary">Rs.{log.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">{log.monthIndex}</td>
                  <td className="px-4 py-3">{new Date(log.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
