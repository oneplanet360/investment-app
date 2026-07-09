import { useState } from "react";
import { commissionSettings } from "../../../lib/data";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function CommissionSettings() {
  const [form, setForm] = useState({ ...commissionSettings });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: parseFloat(v) || 0 }));

  const total = form.level1Rate + form.level2Rate + form.level3Rate + form.level4Rate;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Commission settings saved successfully.");
  };

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6">
      <div className="max-w-xl">
        <h1 className="text-base font-semibold text-gray-700 mb-5">Commission Settings</h1>

        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <p className="text-sm text-gray-500">
            Commissions are paid on every new investment and top-up. Configure the percentage for each agent level below.
          </p>

          <div className="space-y-4">
            {([
              { key: "level1Rate" as const, label: "Level 1 Commission (%)", desc: "Direct agent who onboarded the investor" },
              { key: "level2Rate" as const, label: "Level 2 Commission (%)", desc: "Agent who referred the Level 1 agent" },
              { key: "level3Rate" as const, label: "Level 3 Commission (%)", desc: "Agent who referred the Level 2 agent" },
              { key: "level4Rate" as const, label: "Level 4 Commission (%)", desc: "Agent who referred the Level 3 agent" },
            ]).map(({ key, label, desc }) => (
              <div key={key} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">{label}</label>
                <p className="text-xs text-gray-400 mb-2">{desc}</p>
                <input
                  type="number" step="0.01" min="0" max="100"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 bg-white transition-colors"
                />
              </div>
            ))}
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium ${total === 4 ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
            <span>Total Distribution</span>
            <span>{total.toFixed(2)}% {total === 4 ? "✓" : `(target: 4.00%)`}</span>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save size={15} /> Save Commission Settings
          </button>
        </form>
      </div>
    </div>
  );
}
