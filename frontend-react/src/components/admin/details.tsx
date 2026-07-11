import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  DollarSign,
  Briefcase,
  ArrowDownToLine,
  Hand,
  CheckCircle,
  Landmark,
  ArrowUpDown,
  LogIn,
  Wallet,
  Bell,
  Ban,
} from "lucide-react";
import {
  useAdminAgentDetail,
  useImpersonateAgent,
  useToggleBanAgent,
  useSendNotificationAgent,
} from "../../services/admin/adminAgents/adminAgents.query";
import {
  useAdminInvestorDetail,
  useImpersonateInvestor,
  useToggleBanInvestor,
  useSendNotificationInvestor,
} from "../../services/admin/adminInvestors/adminInvestors.query";
import type { IUserDetailResponse } from "../../services/admin/adminUsers.types";
import { useEffect } from "react";

type ColorCard = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
};

function ColorCard({ label, value, icon, bg }: ColorCard) {
  return (
    <div className={`rounded-lg p-4 flex items-center justify-between ${bg}`}>
      <div>
        <p className="text-xs text-white/80">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  );
}

type Tab = "balance-add" | "balance-sub";

const tabs: { id: Tab; label: string; color: string }[] = [
  {
    id: "balance-add",
    label: "Balance",
    color: "bg-green-500 hover:bg-green-600",
  },
  { id: "balance-sub", label: "Balance", color: "bg-red-500 hover:bg-red-600" },
];

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "Colombia",
  "Costa Rica",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Gambia",
  "Germany",
  "Ghana",
  "Greece",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Italy",
  "Japan",
  "Jordan",
  "Kenya",
  "Kuwait",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tanzania",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Kingdom",
  "United States",
  "Venezuela",
  "Vietnam",
  "Zambia",
  "Zimbabwe",
];

export default function UserDetail() {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const isAgent = location.pathname.includes("/agents/");
  const typeLabel = isAgent ? "Agent" : "Investor";
  const backLink = isAgent ? "/agents" : "/investors";

  const { data: agentRes, isLoading: agentLoading } = useAdminAgentDetail(
    username || "",
    { enabled: isAgent && !!username },
  );
  const { data: invRes, isLoading: invLoading } = useAdminInvestorDetail(
    username || "",
    { enabled: !isAgent && !!username },
  );

  const { mutate: impersonateAgent, isPending: agentImpersonating } =
    useImpersonateAgent();
  const { mutate: impersonateInvestor, isPending: invImpersonating } =
    useImpersonateInvestor();

  const handleImpersonate = () => {
    if (!username) return;
    if (isAgent) {
      impersonateAgent(username);
    } else {
      impersonateInvestor(username);
    }
  };

  const isLoading = isAgent ? agentLoading : invLoading;
  const res = (isAgent ? agentRes : invRes) as IUserDetailResponse | undefined;
  const user = res?.user;
  const stats = res?.stats || {
    balance: 0,
    totalInvestments: 0,
    totalContribution: 0,
    closeRequests: 0,
    completedInvestments: 0,
    deposits: 0,
    withdrawals: 0,
    transactions: 0,
  };

  const { mutate: toggleBanAgent, isPending: banAgentPending } =
    useToggleBanAgent();
  const { mutate: toggleBanInvestor, isPending: banInvestorPending } =
    useToggleBanInvestor();

  const { mutate: sendNotificationAgent, isPending: sendNotifAgentPending } =
    useSendNotificationAgent();
  const {
    mutate: sendNotificationInvestor,
    isPending: sendNotifInvestorPending,
  } = useSendNotificationInvestor();

  const handleToggleBan = () => {
    if (!username) return;
    if (isAgent) {
      toggleBanAgent(username);
    } else {
      toggleBanInvestor(username);
    }
  };

  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifForm, setNotifForm] = useState({ title: "", message: "" });

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !notifForm.title || !notifForm.message) return;

    const onSendSuccess = () => {
      setShowNotifModal(false);
      setNotifForm({ title: "", message: "" });
    };

    if (isAgent) {
      sendNotificationAgent(
        { username, ...notifForm },
        { onSuccess: onSendSuccess },
      );
    } else {
      sendNotificationInvestor(
        { username, ...notifForm },
        { onSuccess: onSendSuccess },
      );
    }
  };

  const [activeTab, setActiveTab] = useState<Tab>("balance-add");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    emailVerified: false,
    mobileVerified: false,
    twoFa: false,
    kyc: "unverified",
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || "",
        country: user.country || "",
        emailVerified: user.emailVerified || false,
        mobileVerified: user.mobileVerified || false,
        twoFa: user.twoFa || false,
        kyc: user.kycStatus || "UNVERIFIED",
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-full bg-(--theme-bg) p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-full bg-(--theme-bg) p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">{typeLabel} not found.</p>
        <Link to={backLink} className="text-sm text-indigo-600 hover:underline">
          ← Back to All {typeLabel}s
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-(--theme-bg) p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-base font-semibold text-gray-700">
          {typeLabel} Detail &ndash; {user.username}
        </h1>
        <button
          onClick={handleImpersonate}
          disabled={agentImpersonating || invImpersonating}
          className="flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-400 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          <LogIn size={13} />
          {agentImpersonating || invImpersonating
            ? "Logging in..."
            : `Login as ${typeLabel}`}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <ColorCard
          label="Balance"
          value={`$${stats.balance.toFixed(2)} USD`}
          bg="bg-sky-500"
          icon={<DollarSign size={22} className="text-white" />}
        />
        <ColorCard
          label="Total Investments"
          value={stats.totalInvestments}
          bg="bg-indigo-700"
          icon={<Briefcase size={22} className="text-white" />}
        />
        <ColorCard
          label="Total Contribution"
          value={`$${stats.totalContribution.toFixed(2)} USD`}
          bg="bg-purple-600"
          icon={<ArrowDownToLine size={22} className="text-white" />}
        />
        <ColorCard
          label="Investment Close Requests"
          value={stats.closeRequests}
          bg="bg-red-700"
          icon={<Hand size={22} className="text-white" />}
        />
        <ColorCard
          label="Completed Investments"
          value={stats.completedInvestments}
          bg="bg-green-600"
          icon={<CheckCircle size={22} className="text-white" />}
        />
        <ColorCard
          label="Deposits"
          value={`$${stats.deposits.toFixed(2)} USD`}
          bg="bg-teal-600"
          icon={<Wallet size={22} className="text-white" />}
        />
        <ColorCard
          label="Withdrawals"
          value={`$${stats.withdrawals.toFixed(2)} USD`}
          bg="bg-yellow-600"
          icon={<Landmark size={22} className="text-white" />}
        />
        <ColorCard
          label="Transactions"
          value={stats.transactions}
          bg="bg-cyan-600"
          icon={<ArrowUpDown size={22} className="text-white" />}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded transition-colors ${tab.color} ${activeTab === tab.id ? "ring-2 ring-offset-1 ring-current opacity-100" : "opacity-80"}`}
          >
            {tab.id === "balance-add" && <Wallet size={14} />}
            {tab.id === "balance-sub" && <Wallet size={14} />}
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setShowNotifModal(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded transition-colors bg-gray-500 hover:bg-gray-600 opacity-80"
        >
          <Bell size={14} />
          Notifications
        </button>
        <button
          onClick={handleToggleBan}
          disabled={banAgentPending || banInvestorPending}
          className={`flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded transition-colors ${user.isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"} opacity-80 disabled:opacity-50`}
        >
          <Ban size={14} />
          {user.isActive ? "Ban User" : "Unban User"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">
          Information of {user.firstName} {user.lastName}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-200 rounded overflow-hidden focus-within:border-indigo-400 transition-colors">
              <span className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-r border-gray-200">
                +
              </span>
              <input
                type="tel"
                value={form.mobile.replace(/^\+/, "")}
                onChange={(e) =>
                  setForm({ ...form, mobile: "+" + e.target.value })
                }
                className="flex-1 px-3 py-2 text-sm text-gray-700 outline-none bg-transparent"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Zip / Postal
            </label>
            <input
              type="text"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors bg-white"
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Email Verification
            </label>
            <button
              onClick={() =>
                setForm({ ...form, emailVerified: !form.emailVerified })
              }
              className={`w-full py-2 rounded text-sm font-medium text-white transition-colors ${form.emailVerified ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            >
              {form.emailVerified ? "Verified" : "Unverified"}
            </button>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Mobile Verification
            </label>
            <button
              onClick={() =>
                setForm({ ...form, mobileVerified: !form.mobileVerified })
              }
              className={`w-full py-2 rounded text-sm font-medium text-white transition-colors ${form.mobileVerified ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            >
              {form.mobileVerified ? "Verified" : "Unverified"}
            </button>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              2FA Verification
            </label>
            <button
              onClick={() => setForm({ ...form, twoFa: !form.twoFa })}
              className={`w-full py-2 rounded text-sm font-medium text-white transition-colors ${form.twoFa ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            >
              {form.twoFa ? "Enabled" : "Disable"}
            </button>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">KYC</label>
            <button
              onClick={() => {
                const next =
                  form.kyc === "unverified"
                    ? "pending"
                    : form.kyc === "pending"
                      ? "verified"
                      : "unverified";
                setForm({ ...form, kyc: next });
              }}
              className={`w-full py-2 rounded text-sm font-medium text-white transition-colors capitalize ${form.kyc === "verified" ? "bg-green-500 hover:bg-green-600" : form.kyc === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600"}`}
            >
              {form.kyc}
            </button>
          </div>
        </div>

        <button className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded transition-colors">
          Submit
        </button>
      </div>

      {showNotifModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Send Notification</h3>
              <button
                onClick={() => setShowNotifModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSendNotification} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={notifForm.title}
                  onChange={(e) =>
                    setNotifForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                  placeholder="Notification Title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={notifForm.message}
                  onChange={(e) =>
                    setNotifForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none resize-none"
                  placeholder="Enter message here..."
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNotifModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendNotifAgentPending || sendNotifInvestorPending}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors disabled:opacity-50"
                >
                  {sendNotifAgentPending || sendNotifInvestorPending
                    ? "Sending..."
                    : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
