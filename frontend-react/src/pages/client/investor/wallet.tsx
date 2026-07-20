import { useState, useEffect } from "react";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  DollarSign,
  ListOrdered,
  TrendingUp,
} from "lucide-react";
import {
  getClientWalletFn,
  getClientWalletTransactionsFn,
} from "../../../services/client/clientWallet/clientWallet.api";
import { toast } from "sonner";

export type WalletTransaction = {
  _id: string;
  trxId: string;
  transactionType: string;
  amountDisplay: string;
  gateway: string;
  status: string;
  createdAt: string;
};

export default function InvestorWallet() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<Record<string, unknown> | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletData, txData] = await Promise.all([
          getClientWalletFn(),
          getClientWalletTransactionsFn(),
        ]);
        setWallet(walletData);
        setTransactions(txData as WalletTransaction[]);
      } catch {
        toast.error("Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-brand-primary">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-client-text">
          My Wallet
        </h2>
        <p className="text-sm text-client-text-secondary mt-1">
          Manage your balances and view recent transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-client-card border border-client-border rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-client-bg-secondary rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-brand-primary/20"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-client-bg-secondary flex items-center justify-center text-brand-primary">
              <WalletIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-client-text-secondary">
                Available Balance
              </p>
              <h3 className="text-2xl font-bold text-client-text">
                Rs.{(wallet?.walletBalance as number)?.toFixed(2) || "0.00"}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-client-card border border-client-border rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-client-info/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-client-info/20"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-client-info/10 flex items-center justify-center text-brand-primary">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-client-text-secondary">
                Investment Balance
              </p>
              <h3 className="text-2xl font-bold text-client-text">
                Rs.{(wallet?.investmentBalance as number)?.toFixed(2) || "0.00"}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-client-card border border-client-border rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/20"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-client-text-secondary">ROI Balance</p>
              <h3 className="text-2xl font-bold text-client-text">
                Rs.{(wallet?.roiBalance as number)?.toFixed(2) || "0.00"}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-client-card border border-client-border rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-brand-primary">
              <ArrowDownLeft size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-client-text-secondary">
                Total Withdrawn
              </p>
              <h3 className="text-2xl font-bold text-client-text">
                Rs.{(wallet?.totalWithdrawals as number)?.toFixed(2) || "0.00"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-client-card border border-client-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-client-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-client-text flex items-center gap-2">
            <ListOrdered size={20} className="text-brand-primary" />
            Recent Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-client-border bg-client-card">
                <th className="py-4 px-6 font-medium text-sm text-client-text-secondary">
                  Transaction ID
                </th>
                <th className="py-4 px-6 font-medium text-sm text-client-text-secondary">
                  Type
                </th>
                <th className="py-4 px-6 font-medium text-sm text-client-text-secondary">
                  Amount
                </th>
                <th className="py-4 px-6 font-medium text-sm text-client-text-secondary">
                  Status
                </th>
                <th className="py-4 px-6 font-medium text-sm text-client-text-secondary">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-client-text-secondary text-sm"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-client-border hover:bg-client-card/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-client-text font-medium">
                      {tx.trxId}
                    </td>
                    <td className="py-4 px-6 text-sm text-client-text-secondary flex items-center gap-2">
                      {tx.transactionType === "DEPOSIT" ? (
                        <ArrowDownLeft size={16} className="text-green-500" />
                      ) : (
                        <ArrowUpRight size={16} className="text-client-error" />
                      )}
                      {tx.transactionType}
                    </td>
                    <td
                      className={`py-4 px-6 text-sm font-bold ${tx.transactionType === "DEPOSIT" ? "text-green-500" : "text-client-error"}`}
                    >
                      {tx.amountDisplay}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          tx.status === "SUCCESSFUL" || tx.status === "APPROVED"
                            ? "bg-green-500/10 text-green-500"
                            : tx.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-client-error/10 text-client-error"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-client-text-secondary">
                      {new Date(tx.createdAt).toLocaleDateString()}
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
