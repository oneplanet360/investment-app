import { useClientInvestorsQuery } from "../../../services/client/clientAgent/clientAgent.queries";

export default function Team() {
  const { data: investors = [], isLoading } = useClientInvestorsQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Team</h2>
          <p className="text-sm text-zinc-400 mt-1">
            View your direct referred investors.
          </p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-[#1a1a1a] text-zinc-500 border-b border-[#222]">
            <tr>
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">KYC Status</th>
              <th className="px-4 py-3 font-medium">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  Loading team...
                </td>
              </tr>
            ) : investors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  No investors found.
                </td>
              </tr>
            ) : (
              investors.map((investor: any) => (
                <tr
                  key={investor._id}
                  className="hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {investor.username}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{investor.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-[10px] font-semibold tracking-wide rounded-md ${investor.kycStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                    >
                      {investor.kycStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(investor.createdAt).toLocaleDateString()}
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
