import { useState, useEffect } from "react";
import { Loader2, Users, Mail, Phone, MapPin } from "lucide-react";
import type { IInvestor } from "../../../types";
import { getClientInvestorsFn } from "../../../services/client/clientAgent/clientAgent.api";
import { toast } from "sonner";

export default function AllInvestors() {
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<IInvestor[]>([]);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const data = await getClientInvestorsFn();
        setInvestors(data);
      } catch {
        toast.error("Failed to load investors");
      } finally {
        setLoading(false);
      }
    };
    fetchInvestors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-orange-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          All Investors
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          View and manage all investors in your downline network.
        </p>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#222] flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users size={20} className="text-orange-500" />
            Your Referrals ({investors.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] bg-[#1a1a1a]">
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Name / Username
                </th>
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Contact
                </th>
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Country
                </th>
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Status
                </th>
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Joined Date
                </th>
              </tr>
            </thead>
            <tbody>
              {investors.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-zinc-500 text-sm"
                  >
                    No investors found in your network.
                  </td>
                </tr>
              ) : (
                investors.map((user: IInvestor) => (
                  <tr
                    key={user._id}
                    className="border-b border-[#222] hover:bg-[#1a1a1a]/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-zinc-400">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                          <Mail size={14} className="text-zinc-500" />
                          {user.email}
                        </div>
                        {user.mobile && (
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Phone size={14} className="text-zinc-500" />
                            {user.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <MapPin size={14} className="text-zinc-500" />
                        {user.country || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.kycStatus === "APPROVED"
                            ? "bg-green-500/10 text-green-500"
                            : user.kycStatus === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {user.kycStatus === "APPROVED"
                          ? "KYC Verified"
                          : "Unverified"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-zinc-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
