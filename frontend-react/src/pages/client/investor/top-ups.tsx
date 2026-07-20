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
          <p className="text-sm text-client-text-secondary mt-1">
            View your account top-ups and deposits.
          </p>
        </div>
        <button className="py-2.5 px-4 bg-brand-primary hover:bg-brand-hover transition-colors rounded-xl text-xs font-semibold text-client-text flex items-center gap-2">
          <Plus size={16} />
          New Top-up
        </button>
      </div>

      <div className="bg-client-card border border-client-border rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-client-text-secondary">
          <thead className="text-xs uppercase bg-client-card text-client-text-secondary border-b border-client-border">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Gateway</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-client-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-client-text-secondary">
                  Loading top-ups...
                </td>
              </tr>
            ) : deposits.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-client-text-secondary">
                  No top-ups found.
                </td>
              </tr>
            ) : (
              deposits.map((deposit: any) => (
                <tr key={deposit._id} className="hover:bg-client-card transition-colors">
                  <td className="px-4 py-3 font-medium text-client-text">{deposit.trxId}</td>
                  <td className="px-4 py-3 text-client-text">Rs.{deposit.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{deposit.gateway}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-[10px] font-semibold tracking-wide rounded-md bg-client-success/10 text-brand-primary">
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
