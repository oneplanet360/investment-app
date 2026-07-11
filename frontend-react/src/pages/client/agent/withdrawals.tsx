import { useState, useEffect } from "react";
import { Loader2, DollarSign, PlusCircle, CreditCard } from "lucide-react";
import type { IWithdrawal } from "../../../types";
import {
  getClientWithdrawalsFn,
  requestClientWithdrawalFn,
} from "../../../services/client/clientWithdrawal/clientWithdrawal.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function AgentWithdrawals() {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<IWithdrawal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    gateway: "",
  });

  const fetchWithdrawals = async () => {
    try {
      const data = await getClientWithdrawalsFn();
      setWithdrawals(data);
    } catch {
      toast.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchWithdrawals();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await requestClientWithdrawalFn({
        amount: Number(formData.amount),
        gateway: formData.gateway,
        type: "COMMISSION", // Agents withdraw commissions
      });
      toast.success("Withdrawal requested successfully");
      setShowForm(false);
      setFormData({ amount: "", gateway: "" });
      fetchWithdrawals();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to request withdrawal",
        );
      } else {
        toast.error("Failed to request withdrawal");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-orange-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Withdrawals
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Request new withdrawals and view your withdrawal history.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 py-2.5 px-6 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-white shadow-lg shadow-orange-500/20"
        >
          {showForm ? (
            "Cancel Request"
          ) : (
            <>
              <PlusCircle size={16} /> Request Withdrawal
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#141414] border border-[#222] rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            <h3 className="text-lg font-bold text-white">
              New Withdrawal Request
            </h3>
            <p className="text-sm text-zinc-400">
              Withdraw your commission balance to your preferred gateway.
            </p>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-zinc-300">
                Amount ($)
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="number"
                  name="amount"
                  required
                  min="1"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Gateway
              </label>
              <div className="relative">
                <CreditCard
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <select
                  name="gateway"
                  required
                  value={formData.gateway}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none"
                >
                  <option value="" disabled>
                    Select a gateway
                  </option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="USDT_TRC20">USDT (TRC20)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="PAYPAL">PayPal</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-6 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#222]">
          <h3 className="text-lg font-bold text-white">Withdrawal History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] bg-[#1a1a1a]">
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Transaction ID
                </th>
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Amount
                </th>
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Gateway
                </th>
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Status
                </th>
                <th className="py-4 px-6 font-medium text-sm text-zinc-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-zinc-500 text-sm"
                  >
                    No withdrawals found.
                  </td>
                </tr>
              ) : (
                withdrawals.map((item: IWithdrawal) => (
                  <tr
                    key={item._id}
                    className="border-b border-[#222] hover:bg-[#1a1a1a]/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-white font-medium">
                      {item.trxId}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-white">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm text-zinc-300">
                      {item.gateway}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === "APPROVED"
                            ? "bg-green-500/10 text-green-500"
                            : item.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-zinc-400">
                      {new Date(item.createdAt).toLocaleDateString()}
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
