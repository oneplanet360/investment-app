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
    createInvestor(
      formData,
      {
        onSuccess: () => navigate("/agent/all-investors"),
      },
    );
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
        <div className="w-10 h-10 rounded-xl bg-client-bg-secondary flex items-center justify-center text-brand-primary">
          {isLevel4 ? <UserCheck size={20} /> : <UserPlus size={20} />}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-client-text tracking-tight">
            {isLevel4 ? "Create Investor" : "Assign User"}
          </h1>
          <p className="text-sm text-client-text-secondary">
            {isLevel4 
              ? "Create a new investor and add them directly under your downline." 
              : "Search for unassigned users and add them as your sub-agent."}
          </p>
        </div>
      </div>

      {isLevel4 ? (
        <div className="bg-client-card border border-client-border rounded-2xl p-6">
          <form onSubmit={handleCreateInvestor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-client-text-secondary mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full bg-client-card border border-client-border rounded-xl px-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-client-text-secondary mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full bg-client-card border border-client-border rounded-xl px-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-client-text-secondary mb-1">Mobile (Optional)</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full bg-client-card border border-client-border rounded-xl px-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-client-text-secondary mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full bg-client-card border border-client-border rounded-xl px-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-client-text-secondary mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-client-card border border-client-border rounded-xl px-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreatingInvestor}
              className="w-full mt-4 px-6 py-3 bg-brand-primary hover:bg-brand-hover text-client-text text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {isCreatingInvestor ? "Creating Investor..." : "Create Investor"}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-client-card border border-client-border rounded-2xl p-6 md:p-8 shadow-sm">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group/input">
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    placeholder="Enter exact username to search"
                    className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-4 py-3 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchUsername}
                  className="shrink-0 flex items-center justify-center gap-2 py-3 px-8 bg-brand-primary hover:bg-brand-hover active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-client-text shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                  <span className="relative z-10">
                    {isSearching ? "Searching..." : "Search"}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {searchResult && (
            <div className="p-5 rounded-xl border border-brand-primary/30 bg-client-card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-client-bg flex items-center justify-center text-client-text-secondary">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-client-text font-semibold">{searchResult.name}</h3>
                  <p className="text-sm text-client-text-secondary">@{searchResult.username}</p>
                  <p className="text-xs text-client-text-secondary mt-1">
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
                <button
                  onClick={handleAssignSubAgent}
                  disabled={isAssigningSubAgent}
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-client-text text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isAssigningSubAgent ? "Assigning..." : "Assign as Sub-Agent"}
                </button>
              </div>
            </div>
          )}

          {searchResult === null && (
            <div className="p-8 text-center border border-dashed border-client-border rounded-xl">
              <p className="text-client-text-secondary">
                No available user found with that username.
              </p>
              <p className="text-xs text-client-text-secondary mt-1">
                They might not exist, or they already have a sponsor.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
