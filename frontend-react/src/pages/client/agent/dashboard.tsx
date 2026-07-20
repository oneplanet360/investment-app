import { useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Wallet,
  Percent,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAgentDashboardStatsQuery } from "../../../services/client/clientAgent/clientAgent.queries";
import { getAgentCommissionsFn } from "../../../services/client/clientAgent/clientAgent.api";
import { useClientKycStatusQuery } from "../../../services/client/clientKyc/clientKyc.queries";

export default function AgentDashboard() {
  const [activeTab] = useState("dashboard");
  const { data: statsData } = useAgentDashboardStatsQuery();
  const { data: kycStatus } = useClientKycStatusQuery();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadStatements = async () => {
    try {
      setIsDownloading(true);
      const commissions = await getAgentCommissionsFn();
      
      const headers = ["Transaction ID", "Investor Username", "Level", "Amount (Rs.)", "Status", "Date"];
      const rows = commissions.map((c: any) => [
        c.trxId,
        c.investorId?.username || "Unknown",
        c.level,
        c.amount,
        c.status,
        new Date(c.createdAt).toLocaleString()
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row: any[]) => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `agent_statement_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download statements", err);
    } finally {
      setIsDownloading(false);
    }
  };
  const stats = statsData || {
    totalBalance: 0,
    activeReferrals: 0,
    totalCommissions: 0,
    level1Bonuses: 0,
    recentCommissions: []
  };

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
                  value: `Rs.${stats.totalBalance.toLocaleString()}`,
                  change: "+0.0%",
                  icon: Wallet,
                  color:
                    "from-brand-primary/20 to-brand-hover/10 border-brand-primary/30",
                  iconColor: "text-brand-primary",
                },
                {
                  label: "Active Referrals",
                  value: `${stats.activeReferrals} Partners`,
                  change: "+0.0%",
                  icon: TrendingUp,
                  color:
                    "from-brand-primary/20 to-brand-hover/10 border-brand-primary/30",
                  iconColor: "text-brand-primary",
                },
                {
                  label: "Total Commissions",
                  value: `Rs.${stats.totalCommissions.toLocaleString()}`,
                  change: "+0.0%",
                  icon: DollarSign,
                  color: "from-brand-primary/20 to-brand-hover/10 border-brand-primary/30",
                  iconColor: "text-brand-primary",
                },
                {
                  label: "Level-1 Bonuses",
                  value: `Rs.${stats.level1Bonuses.toLocaleString()}`,
                  change: "+0.0%",
                  icon: Percent,
                  color:
                    "from-brand-primary/20 to-brand-hover/10 border-brand-primary/30",
                  iconColor: "text-brand-primary",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`bg-client-card border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-primary/[0.02] ${stat.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-client-text-secondary text-xs font-medium uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <div
                      className={`p-2 rounded-xl bg-white/[0.02] ${stat.iconColor}`}
                    >
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {stat.value}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-brand-primary font-medium">
                      <ArrowUpRight size={14} />
                      <span>{stat.change} this month</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Trend */}
              <div className="bg-client-card border border-client-border rounded-2xl p-6">
                <h3 className="text-base font-bold mb-4">Earnings Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.commissionChartData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#C9BEF6" vertical={false} />
                      <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#C9BEF6', borderRadius: '8px', color: '#1e1b4b' }} 
                        itemStyle={{ color: '#7c3aed' }} 
                      />
                      <Line type="monotone" dataKey="earnings" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Team Growth */}
              <div className="bg-client-card border border-client-border rounded-2xl p-6">
                <h3 className="text-base font-bold mb-4">Team Growth</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.downlineChartData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#C9BEF6" vertical={false} />
                      <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#C9BEF6', borderRadius: '8px', color: '#1e1b4b' }} 
                        itemStyle={{ color: '#7c3aed' }}
                        cursor={{ fill: '#EBE6FE' }}
                      />
                      <Bar dataKey="users" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="w-full bg-client-card border border-client-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">Recent Commissions</h3>
                  <button className="text-xs text-brand-primary hover:text-brand-primary font-medium">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-client-border">
                  {stats.recentCommissions.length === 0 && (
                    <div className="py-4 text-sm text-client-text-secondary text-center">No recent commissions</div>
                  )}
                  {stats.recentCommissions.map((tx: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl bg-client-success/10 text-brand-primary`}
                        >
                          <ArrowDownLeft size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-client-text leading-tight">
                            Commission from {tx.investorId?.username || 'Unknown'} (Level {tx.level})
                          </p>
                          <span className="text-[11px] text-client-text-secondary mt-1 block">
                            {new Date(tx.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brand-primary">
                          +Rs.{tx.amount.toLocaleString()}
                        </p>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${tx.status === "PAID"
                            ? "bg-client-success/10 text-brand-primary"
                            : "bg-client-bg-secondary text-brand-primary"
                            }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-client-card border border-client-border rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-client-bg-secondary flex items-center justify-center text-brand-primary mb-4">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-lg font-bold capitalize">
              {activeTab.replace("-", " ")}
            </h3>
            <p className="text-sm text-client-text-secondary max-w-sm mt-2">
              This panel demonstrates active view selection from the sidebar.
              Navigated path:{" "}
              <code className="text-brand-primary font-mono bg-client-bg px-1.5 py-0.5 rounded">
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
          <h2 className="text-2xl font-bold tracking-tight capitalize flex items-center gap-3">
            {activeTab === "dashboard"
              ? "Agent Dashboard"
              : activeTab.replace("-", " ")}
            {activeTab === "dashboard" && (
              kycStatus?.status === "APPROVED" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-client-success/10 text-green-500 border border-green-500/20">
                  <BadgeCheck size={14} />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-client-error/10 text-client-error border border-client-error/20">
                  <ShieldAlert size={14} />
                  Not Verified
                </span>
              )
            )}
          </h2>
          <p className="text-sm text-client-text-secondary mt-1">
            Manage your asset packages, check logs, and monitor yields in
            real-time.
          </p>
        </div>
        {activeTab === "dashboard" && (
          <button 
            onClick={handleDownloadStatements}
            disabled={isDownloading}
            className="py-2.5 px-4 bg-black/5 border border-client-border hover:bg-black/10 active:scale-[0.98] transition-all rounded-xl text-xs font-semibold text-client-text disabled:opacity-50"
          >
            {isDownloading ? "Downloading..." : "Download Statements"}
          </button>
        )}
      </div>

      {/* Tab Specific Content */}
      {renderContent()}
    </div>
  );
}
