import { useClientInvestorsQuery } from "../../../services/client/clientAgent/clientAgent.queries";

export default function Team() {
  const { data: investors = [], isLoading } = useClientInvestorsQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Team</h2>
          <p className="text-sm text-client-text-secondary mt-1">
            View your direct referred investors.
          </p>
        </div>
      </div>

      <div className="bg-client-card border border-client-border rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-client-text-secondary">
          <thead className="text-xs uppercase bg-client-card text-client-text-secondary border-b border-client-border">
            <tr>
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">KYC Status</th>
              <th className="px-4 py-3 font-medium">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-client-border">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-client-text-secondary">
                  Loading team...
                </td>
              </tr>
            ) : investors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-client-text-secondary">
                  No investors found.
                </td>
              </tr>
            ) : (
              investors.map((investor: any) => (
                <tr key={investor._id} className="hover:bg-client-card transition-colors">
                  <td className="px-4 py-3 font-medium text-client-text">{investor.username}</td>
                  <td className="px-4 py-3 text-client-text-secondary">{investor.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-[10px] font-semibold tracking-wide rounded-md ${investor.kycStatus === 'APPROVED' ? 'bg-client-success/10 text-brand-primary' : 'bg-client-bg-secondary text-brand-primary'}`}>
                      {investor.kycStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(investor.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
