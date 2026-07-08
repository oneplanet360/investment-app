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
import { users } from "../../lib/data";

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

type Tab = "balance-add" | "balance-sub" | "logins" | "notifications" | "ban";

const tabs: { id: Tab; label: string; color: string }[] = [
  { id: "balance-add", label: "Balance", color: "bg-green-500 hover:bg-green-600" },
  { id: "balance-sub", label: "Balance", color: "bg-red-500 hover:bg-red-600" },
  { id: "logins", label: "Logins", color: "bg-indigo-600 hover:bg-indigo-700" },
  { id: "notifications", label: "Notifications", color: "bg-gray-500 hover:bg-gray-600" },
  { id: "ban", label: "Ban User", color: "bg-orange-500 hover:bg-orange-600" },
];

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Bangladesh", "Belgium", "Brazil", "Canada", "China", "Colombia", "Costa Rica",
  "Denmark", "Egypt", "Ethiopia", "Finland", "France", "Gambia", "Germany",
  "Ghana", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy",
  "Japan", "Jordan", "Kenya", "Kuwait", "Malaysia", "Mexico", "Morocco",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru",
  "Philippines", "Poland", "Portugal", "Romania", "Russia", "Saudi Arabia",
  "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Tanzania",
  "Thailand", "Turkey", "Uganda", "Ukraine", "United Kingdom", "United States",
  "Venezuela", "Vietnam", "Zambia", "Zimbabwe",
];

export default function UserDetail() {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const isAgent = location.pathname.includes("/agents/");
  const typeLabel = isAgent ? "Agent" : "Investor";
  const backLink = isAgent ? "/agents" : "/investors";
  
  const user = users.find((u) => u.username === username);
  const [activeTab, setActiveTab] = useState<Tab>("logins");

  if (!user) {
    return (
      <div className="min-h-full bg-[#f0f2f8] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">{typeLabel} not found.</p>
        <Link to={backLink} className="text-sm text-indigo-600 hover:underline">
          ← Back to All {typeLabel}s
        </Link>
      </div>
    );
  }

  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    city: user.city,
    state: user.state,
    zip: user.zip,
    country: user.country,
    emailVerified: user.emailVerified,
    mobileVerified: user.mobileVerified,
    twoFa: user.twoFa,
    kyc: user.kyc,
  });

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-base font-semibold text-gray-700">
          {typeLabel} Detail &ndash; {user.username}
        </h1>
        {!isAgent && (
          <button className="flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-400 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors">
            <LogIn size={13} />
            Login as {typeLabel}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <ColorCard
          label="Balance"
          value={`$${user.balance.toFixed(2)} USD`}
          bg="bg-sky-500"
          icon={<DollarSign size={22} className="text-white" />}
        />
        <ColorCard
          label="Total Investments"
          value={user.totalInvestments}
          bg="bg-indigo-700"
          icon={<Briefcase size={22} className="text-white" />}
        />
        <ColorCard
          label="Total Contribution"
          value={`$${user.totalContribution.toFixed(2)} USD`}
          bg="bg-purple-600"
          icon={<ArrowDownToLine size={22} className="text-white" />}
        />
        <ColorCard
          label="Investment Close Requests"
          value={user.closeRequests}
          bg="bg-red-700"
          icon={<Hand size={22} className="text-white" />}
        />
        <ColorCard
          label="Completed Investments"
          value={user.completedInvestments}
          bg="bg-green-600"
          icon={<CheckCircle size={22} className="text-white" />}
        />
        <ColorCard
          label="Deposits"
          value={`$${user.deposits.toFixed(2)} USD`}
          bg="bg-teal-600"
          icon={<Wallet size={22} className="text-white" />}
        />
        <ColorCard
          label="Withdrawals"
          value={`$${user.withdrawals.toFixed(2)} USD`}
          bg="bg-yellow-600"
          icon={<Landmark size={22} className="text-white" />}
        />
        <ColorCard
          label="Transactions"
          value={user.transactions}
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
            {tab.id === "logins" && <LogIn size={14} />}
            {tab.id === "notifications" && <Bell size={14} />}
            {tab.id === "ban" && <Ban size={14} />}
            {tab.label}
          </button>
        ))}
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
                onChange={(e) => setForm({ ...form, mobile: "+" + e.target.value })}
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
            <label className="block text-xs text-gray-500 mb-1">Zip / Postal</label>
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
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email Verification</label>
            <button
              onClick={() => setForm({ ...form, emailVerified: !form.emailVerified })}
              className={`w-full py-2 rounded text-sm font-medium text-white transition-colors ${form.emailVerified ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            >
              {form.emailVerified ? "Verified" : "Unverified"}
            </button>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mobile Verification</label>
            <button
              onClick={() => setForm({ ...form, mobileVerified: !form.mobileVerified })}
              className={`w-full py-2 rounded text-sm font-medium text-white transition-colors ${form.mobileVerified ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            >
              {form.mobileVerified ? "Verified" : "Unverified"}
            </button>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">2FA Verification</label>
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
                const next = form.kyc === "unverified" ? "pending" : form.kyc === "pending" ? "verified" : "unverified";
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
    </div>
  );
}