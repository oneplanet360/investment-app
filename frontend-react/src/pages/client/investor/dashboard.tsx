import { useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Wallet,
  ArrowUpRight as ArrowUpRightIcon,
  Percent,
} from "lucide-react";

export default function InvestorDashboard() {
  const [activeTab] = useState("dashboard");

  // Render dummy content depending on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  label: "Total Balance",
                  value: "$12,450.80",
                  change: "+12.5%",
                  icon: Wallet,
                  color: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
                  iconColor: "text-orange-500",
                },
                {
                  label: "Active Investments",
                  value: "$8,200.00",
                  change: "+8.3%",
                  icon: TrendingUp,
                  color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
                  iconColor: "text-emerald-500",
                },
                {
                  label: "Total Deposits",
                  value: "$15,000.00",
                  change: "+15.0%",
                  icon: DollarSign,
                  color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30",
                  iconColor: "text-blue-500",
                },
                {
                  label: "Ref. Commission",
                  value: "$1,250.00",
                  change: "+24.1%",
                  icon: Percent,
                  color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
                  iconColor: "text-purple-500",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`bg-[#141414] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/[0.02] ${stat.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <div className={`p-2 rounded-xl bg-white/[0.02] ${stat.iconColor}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
                      <ArrowUpRight size={14} />
                      <span>{stat.change} this month</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Transactions */}
              <div className="lg:col-span-2 bg-[#141414] border border-[#222] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">Recent Transactions</h3>
                  <button className="text-xs text-orange-500 hover:text-orange-400 font-medium">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-[#222]">
                  {[
                    {
                      desc: "Deposit via Bitcoin Wallet",
                      date: "July 8, 2026 09:12 AM",
                      amount: "+$2,500.00",
                      status: "Completed",
                      type: "in",
                    },
                    {
                      desc: "Invested in Gold Premium Plan",
                      date: "July 7, 2026 03:45 PM",
                      amount: "-$5,000.00",
                      status: "Processing",
                      type: "out",
                    },
                    {
                      desc: "Withdrawal to Binance Account",
                      date: "July 5, 2026 11:20 AM",
                      amount: "-$850.00",
                      status: "Completed",
                      type: "out",
                    },
                  ].map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${
                            tx.type === "in"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {tx.type === "in" ? <ArrowDownLeft size={16} /> : <ArrowUpRightIcon size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white leading-tight">{tx.desc}</p>
                          <span className="text-[11px] text-zinc-500 mt-1 block">{tx.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            tx.type === "in" ? "text-emerald-500" : "text-zinc-300"
                          }`}
                        >
                          {tx.amount}
                        </p>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${
                            tx.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Banner / Investment Summary */}
              <div className="bg-gradient-to-br from-[#2a170d] to-[#141414] border border-orange-500/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500 bg-orange-500/15 px-2.5 py-1 rounded-full">
                    Special Offer
                  </span>
                  <h4 className="text-lg font-bold text-white mt-4 leading-snug">
                    Get up to <span className="text-orange-500">18.5% APY</span> on Ethereum Fixed Deposits
                  </h4>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Stake your Ethereum for a minimum of 90 days and unlock premium rewards with instant daily compounding payouts.
                  </p>
                </div>
                <div className="mt-8">
                  <button className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all rounded-xl text-xs font-bold text-white shadow-lg shadow-orange-500/20">
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-lg font-bold capitalize">{activeTab.replace("-", " ")}</h3>
            <p className="text-sm text-zinc-400 max-w-sm mt-2">
              This panel demonstrates active view selection from the sidebar. Navigated path:{" "}
              <code className="text-orange-500 font-mono bg-zinc-800 px-1.5 py-0.5 rounded">
                /{activeTab}
              </code>
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Section title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight capitalize">
            {activeTab === "dashboard" ? "Investor Dashboard" : activeTab.replace("-", " ")}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your asset packages, check logs, and monitor yields in real-time.
          </p>
        </div>
        {activeTab === "dashboard" && (
          <button className="py-2.5 px-4 bg-white/5 border border-[#2c2c2c] hover:bg-white/10 active:scale-[0.98] transition-all rounded-xl text-xs font-semibold text-white">
            Download Statements
          </button>
        )}
      </div>

      {/* Tab Specific Content */}
      {renderContent()}
    </div>
  );
}
