import { useState, useRef } from "react";
import { TrendingUp, XCircle, Upload } from "lucide-react";
import { useClientInvestmentsQuery, useCloseInvestmentMutation, useCreateInvestment } from "../../../services/client/clientInvestments/clientInvestments.query";

export default function Investments() {
  const { data, isLoading } = useClientInvestmentsQuery();
  const { mutate: closeInvestment, isPending } = useCloseInvestmentMutation();
  const { mutate: createInvestment, isPending: isCreating } = useCreateInvestment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closeConfirmId, setCloseConfirmId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const investments = data?.data || [];

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("type", "INITIAL");
    formData.append("paymentProof", file);

    createInvestment(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setAmount("");
        setFile(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Investments</h2>
          <p className="text-sm text-zinc-400 mt-1">
            View your active and completed investment packages.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl text-xs font-semibold text-white flex items-center gap-2"
        >
          <TrendingUp size={16} />
          Invest Now
        </button>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-[#1a1a1a] text-zinc-500 border-b border-[#222]">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Next ROI</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Loading investments...
                </td>
              </tr>
            ) : investments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No investments found.
                </td>
              </tr>
            ) : (
              investments.map((inv: any) => (
                <tr key={inv._id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{inv.trxId}</td>
                  <td className="px-4 py-3 text-white">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{inv.type}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-[10px] font-semibold tracking-wide rounded-md bg-emerald-500/10 text-emerald-400">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(inv.nextRoiDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {inv.status === 'ACTIVE' && (
                      <button 
                        onClick={() => setCloseConfirmId(inv.trxId)}
                        disabled={isPending}
                        className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1 text-xs"
                      >
                        <XCircle size={14} /> Close Investment
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-[#222]">
              <h3 className="text-xl font-bold text-white">New Investment</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Upload your payment proof to request a new investment.
              </p>
            </div>
            
            <form onSubmit={handleInvest} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Amount ($)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Payment Proof (Image)
                </label>
                <div 
                  className="w-full border-2 border-dashed border-[#333] hover:border-orange-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto text-zinc-500 mb-2" size={24} />
                  <p className="text-sm text-zinc-400">
                    {file ? file.name : "Click to upload payment proof"}
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-[#222] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !amount || !file}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl text-sm font-semibold text-white"
                >
                  {isCreating ? "Processing..." : "Submit Investment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {closeConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 border-b border-[#222]">
              <h3 className="text-lg font-bold text-white">Close Investment</h3>
            </div>
            <div className="p-6 text-sm text-zinc-400">
              Are you sure you want to request closing this investment? This action cannot be undone.
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#222] bg-[#1a1a1a]">
              <button
                type="button"
                onClick={() => setCloseConfirmId(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-[#333] transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  closeInvestment(
                    { trxId: closeConfirmId },
                    {
                      onSuccess: () => setCloseConfirmId(null),
                    }
                  );
                }}
                disabled={isPending}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors rounded-lg text-sm font-semibold text-white"
              >
                {isPending ? "Processing..." : "Confirm Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
