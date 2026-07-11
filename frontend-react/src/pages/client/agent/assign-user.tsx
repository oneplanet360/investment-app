import { useState } from "react";
import { UserPlus, Search, User, AlertCircle } from "lucide-react";
import { useClientVerifyUser } from "../../../services/client/clientAuth/clientAuth.query";
import {
  useSearchUnassignedUser,
  useAssignClientSubAgent,
  useAssignClientInvestor,
} from "../../../services/client/clientAgent/clientAgent.queries";
import { useNavigate } from "react-router-dom";

export default function AssignUser() {
  const navigate = useNavigate();
  const { data: userData } = useClientVerifyUser();
  const userLevel = userData?.data?.level;
  const isAgent = userData?.data?.role === "AGENT";
  const isLevel4 = userLevel === 4;

  const targetRole = isLevel4 ? "INVESTOR" : "AGENT";

  const [searchUsername, setSearchUsername] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    data: searchResult,
    isLoading: isSearching,
    refetch,
  } = useSearchUnassignedUser(debouncedSearch, targetRole);

  const { mutate: assignSubAgent, isPending: isAssigningSubAgent } =
    useAssignClientSubAgent();
  const { mutate: assignInvestor, isPending: isAssigningInvestor } =
    useAssignClientInvestor();

  const canAssign = isAgent ? userLevel !== 4 : true;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      setDebouncedSearch(searchUsername.trim());
      refetch();
    }
  };

  const handleAssignSubAgent = () => {
    if (!searchResult) return;
    assignSubAgent(
      { username: searchResult.username },
      {
        onSuccess: () => navigate("/agent/tree"),
      },
    );
  };

  const handleAssignInvestor = () => {
    if (!searchResult) return;
    assignInvestor(
      { username: searchResult.username },
      {
        onSuccess: () => navigate("/agent/all-investors"),
      },
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
          <UserPlus size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Assign User
          </h1>
          <p className="text-sm text-zinc-400">
            Search for unassigned users and add them as your sub-agent or
            investor.
          </p>
        </div>
      </div>

      {!canAssign && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-500 font-medium">Action Not Allowed</h3>
            <p className="text-red-400/80 text-sm mt-1">
              You are currently at Level 4. You cannot assign new sub-agents or
              investors.
            </p>
          </div>
        </div>
      )}

      <div className="bg-[#18181b] border border-[#222] rounded-2xl p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter exact username to search"
              className="w-full bg-[#111] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchUsername}
            className="px-6 py-3 bg-[#222] hover:bg-[#2c2c2c] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {searchResult && (
        <div className="p-5 rounded-xl border border-orange-500/30 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">{searchResult.name}</h3>
              <p className="text-sm text-zinc-400">@{searchResult.username}</p>
              <p className="text-xs text-zinc-500 mt-1">
                Joined{" "}
                {new Date(searchResult.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {canAssign && isAgent && (
              <button
                onClick={handleAssignSubAgent}
                disabled={isAssigningSubAgent}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isAssigningSubAgent ? "Assigning..." : "Assign as Sub-Agent"}
              </button>
            )}
            {canAssign && (
              <button
                onClick={handleAssignInvestor}
                disabled={isAssigningInvestor}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isAssigningInvestor ? "Assigning..." : "Assign as Investor"}
              </button>
            )}
          </div>
        </div>
      )}

      {searchResult === null && (
        <div className="p-8 text-center border border-dashed border-[#333] rounded-xl">
          <p className="text-zinc-400">
            No available user found with that username.
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            They might not exist, or they already have a sponsor.
          </p>
        </div>
      )}
    </div>
  );
}
