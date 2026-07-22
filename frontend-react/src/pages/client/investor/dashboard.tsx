import { useState } from "react";
import { useClientWalletQuery, useClientWalletTransactionsQuery } from "../../../services/client/clientWallet/clientWallet.query";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Wallet,
  ArrowUpRight as ArrowUpRightIcon,
  Percent,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useClientKycStatusQuery } from "../../../services/client/clientKyc/clientKyc.queries";
import { getClientWalletTransactionsFn } from "../../../services/client/clientWallet/clientWallet.api";

export default function InvestorDashboard() {
  const [activeTab] = useState("dashboard");
  const { data: walletData } = useClientWalletQuery();
  const { data: txData } = useClientWalletTransactionsQuery();
  const { data: kycStatus } = useClientKycStatusQuery();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadStatements = async () => {
    try {
      setIsDownloading(true);
      const txs = await getClientWalletTransactionsFn();
      
      const headers = ["Transaction ID", "Type", "Amount", "Status", "Date"];
      const rows = (txs as any[]).map((t: any) => [
        t.trxId,
        t.transactionType,
        t.amountDisplay,
        t.status,
        new Date(t.createdAt).toLocaleString()
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row: any[]) => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `investor_statement_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download statements", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const wallet: any = walletData || {};
  const transactions: any[] = (txData as any) || [];

  const groupedCashFlow: Record<string, { name: string, deposits: number, withdrawals: number }> = {};
  const groupedEarnings: Record<string, { name: string, roi: number, commission: number }> = {};

  transactions.forEach((tx: any) => {
    const dateStr = new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (tx.transactionType === "DEPOSIT" || tx.transactionType === "WITHDRAWAL") {
      if (!groupedCashFlow[dateStr]) groupedCashFlow[dateStr] = { name: dateStr, deposits: 0, withdrawals: 0 };
      if (tx.transactionType === "DEPOSIT") groupedCashFlow[dateStr].deposits += tx.amount;
      if (tx.transactionType === "WITHDRAWAL") groupedCashFlow[dateStr].withdrawals += tx.amount;
    }
    if (tx.transactionType === "ROI" || tx.transactionType === "COMMISSION") {
      if (!groupedEarnings[dateStr]) groupedEarnings[dateStr] = { name: dateStr, roi: 0, commission: 0 };
      if (tx.transactionType === "ROI") groupedEarnings[dateStr].roi += tx.amount;
      if (tx.transactionType === "COMMISSION") groupedEarnings[dateStr].commission += tx.amount;
    }
  });

  const cashFlowData = Object.values(groupedCashFlow).reverse().slice(-7);
  const earningsData = Object.values(groupedEarnings).reverse().slice(-7);

  // Removed mock placeholders to prevent confusion when data is actually empty

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
                  value: `Rs.${(wallet.walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  change: "Available",
                  icon: Wallet,
                  color:
                    "from-brand-primary/20 to-brand-hover/10 border-brand-primary/30",
                  iconColor: "text-brand-primary",
                },
                {
                  label: "Active Investments",
                  value: `Rs.${(wallet.investmentBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  change: "Total Invested",
                  icon: TrendingUp,
                  color:
                    "from-brand-primary/20 to-brand-hover/10 border-brand-primary/30",
                  iconColor: "text-brand-primary",
                },
                {
                  label: "Total Deposits",
                  value: `Rs.${(wallet.totalDeposits || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  change: "All time",
                  icon: DollarSign,
                  color: "from-brand-primary/20 to-brand-hover/10 border-brand-primary/30",
                  iconColor: "text-brand-primary",
                },
                {
                  label: "Total ROI",
                  value: `Rs.${(wallet.roiBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  change: "Earned",
                  icon: Percent,
                  color:
                    "from-brand-primary/20 to-brand-hover/10 border-brand-primary/30",
                  iconColor: "text-brand-primary",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`bg-client-card border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-primary/2 ${stat.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-client-text-secondary text-xs font-medium uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <div
                      className={`p-2 rounded-xl bg-white/2 ${stat.iconColor}`}
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
                      <span>{stat.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cash Flow */}
              <div className="bg-client-card border border-client-border rounded-2xl p-6">
                <h3 className="text-base font-bold mb-4">Cash Flow Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowData}>
                      <defs>
                        <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#C9BEF6" vertical={false} opacity={0.5} />
                      <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#4b5563', borderRadius: '8px', color: '#fff' }} 
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="deposits" name="Deposits" stroke="#10b981" fillOpacity={1} fill="url(#colorDeposits)" />
                      <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#ef4444" fillOpacity={1} fill="url(#colorWithdrawals)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="bg-client-card border border-client-border rounded-2xl p-6">
                <h3 className="text-base font-bold mb-4">Earnings Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#C9BEF6" vertical={false} opacity={0.5} />
                      <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#4b5563', borderRadius: '8px', color: '#fff' }} 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                      />
                      <Bar dataKey="roi" name="ROI" stackId="a" fill="#7c3aed" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="commission" name="Commission" stackId="a" fill="#c084fc" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="w-full bg-client-card border border-client-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">Recent Transactions</h3>
                  <button className="text-xs text-brand-primary hover:text-brand-primary font-medium">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-client-border">
                  {transactions.slice(0, 5).map((tx: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${tx.transactionType === "DEPOSIT"
                            ? "bg-client-success/10 text-brand-primary"
                            : "bg-client-error/10 text-client-error"
                            }`}
                        >
                          {tx.transactionType === "DEPOSIT" ? (
                            <ArrowDownLeft size={16} />
                          ) : (
                            <ArrowUpRightIcon size={16} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-client-text leading-tight capitalize">
                            {tx.transactionType.toLowerCase()}
                          </p>
                          <span className="text-[11px] text-client-text-secondary mt-1 block">
                            {new Date(tx.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${tx.transactionType === "DEPOSIT"
                            ? "text-brand-primary"
                            : "text-client-text-secondary"
                            }`}
                        >
                          {tx.amountDisplay}
                        </p>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${tx.status === "SUCCESSFUL" || tx.status === "APPROVED"
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
          <div className="bg-client-card border border-client-border rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-100">
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
              ? "Investor Dashboard"
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
