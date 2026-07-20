import { useState, useEffect } from "react";
import { Loader2, DollarSign, PlusCircle } from "lucide-react";
import {
  getClientWithdrawalsFn,
  requestClientWithdrawalFn,
} from "../../../services/client/clientWithdrawal/clientWithdrawal.api";
import { useClientKycStatusQuery } from "../../../services/client/clientKyc/clientKyc.queries";
import { toast } from "sonner";
import type { IWithdrawal } from "../../../types";

export default function InvestorWithdrawals() {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<IWithdrawal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
  });

  const { data: kycStatus } = useClientKycStatusQuery();

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
        type: "ROI_WALLET", // Investors withdraw from ROI/Wallet
      });
      toast.success("Withdrawal requested successfully");
      setShowForm(false);
      setFormData({ amount: "" });
      fetchWithdrawals();
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to request withdrawal",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-brand-primary">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-client-text">
            Withdrawals
          </h2>
          <p className="text-sm text-client-text-secondary mt-1">
            Request new withdrawals and view your withdrawal history.
          </p>
        </div>
        <button
          onClick={() => {
            if (kycStatus?.status !== "APPROVED") {
              toast.error("You must be KYC Verified to request a withdrawal.");
              return;
            }
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 py-2.5 px-6 bg-brand-primary hover:bg-brand-hover active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-client-text shadow-lg shadow-brand-primary/20"
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
        <div className="bg-client-card border border-client-border rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            <h3 className="text-lg font-bold text-client-text">
              New Withdrawal Request
            </h3>
            <p className="text-sm text-client-text-secondary">
              Withdraw your wallet balance to your preferred gateway.
            </p>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-client-text-secondary">
                Amount (Rs.)
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary"
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
                  className="w-full bg-client-card border border-client-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary/50 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>


            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-6 bg-brand-primary hover:bg-brand-hover active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-client-text disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="bg-client-card border border-client-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-client-border">
          <h3 className="text-lg font-bold text-client-text">Withdrawal History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-client-border bg-client-card">
                <th className="py-4 px-6 font-medium text-sm text-client-text-secondary">
                  Transaction ID
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
              {withdrawals.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-client-text-secondary text-sm"
                  >
                    No withdrawals found.
                  </td>
                </tr>
              ) : (
                withdrawals.map((item: IWithdrawal) => (
                  <tr
                    key={item._id}
                    className="border-b border-client-border hover:bg-client-card/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-client-text font-medium">
                      {item.trxId}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-client-text">
                      ${item.amount.toFixed(2)}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === "APPROVED"
                            ? "bg-green-500/10 text-green-500"
                            : item.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-client-error/10 text-client-error"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-client-text-secondary">
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
