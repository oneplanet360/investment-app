import { useState } from "react";
import { UserPlus, Search, User, UserCheck } from "lucide-react";
import { useClientVerifyUser } from "../../../services/client/clientAuth/clientAuth.query";
import {
  useSearchUnassignedUser,
  useAssignClientSubAgent,
  useCreateClientInvestor,
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

  const { mutate: createInvestor, isPending: isCreatingInvestor } =
    useCreateClientInvestor();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    mobile: "",
  });

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

  const handleCreateInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    createInvestor(formData, {
      onSuccess: () => navigate("/agent/all-investors"),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isAgent) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
          {isLevel4 ? <UserCheck size={20} /> : <UserPlus size={20} />}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isLevel4 ? "Create Investor" : "Assign User"}
          </h1>
          <p className="text-sm text-zinc-400">
            {isLevel4
              ? "Create a new investor and add them directly under your downline."
              : "Search for unassigned users and add them as your sub-agent."}
          </p>
        </div>
      </div>

      {isLevel4 ? (
        <div className="bg-[#18181b] border border-[#222] rounded-2xl p-6">
          <form onSubmit={handleCreateInvestor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full bg-[#111] border border-[#2c2c2c] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full bg-[#111] border border-[#2c2c2c] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Mobile (Optional)
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full bg-[#111] border border-[#2c2c2c] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full bg-[#111] border border-[#2c2c2c] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-[#111] border border-[#2c2c2c] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreatingInvestor}
              className="w-full mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {isCreatingInvestor ? "Creating Investor..." : "Create Investor"}
            </button>
          </form>
        </div>
      ) : (
        <>
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
                  <h3 className="text-white font-semibold">
                    {searchResult.name}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    @{searchResult.username}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Joined{" "}
                    {new Date(searchResult.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAssignSubAgent}
                  disabled={isAssigningSubAgent}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isAssigningSubAgent ? "Assigning..." : "Assign as Sub-Agent"}
                </button>
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
        </>
      )}
    </div>
  );
}
