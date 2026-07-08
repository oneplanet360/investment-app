import { useState } from "react";
import { roiSettings } from "../../../lib/data";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function RoiSettings() {
  const [form, setForm] = useState({ ...roiSettings });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: parseFloat(v) || 0 }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.minRate > form.maxRate) {
      toast.error("Min rate cannot exceed max rate.");
      return;
    }
    if (form.currentRate < form.minRate || form.currentRate > form.maxRate) {
      toast.error("Current rate must be between min and max rate.");
      return;
    }
    toast.success("ROI settings saved successfully.");
  };

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6">
      <div className="max-w-xl">
        <h1 className="text-base font-semibold text-gray-700 mb-5">ROI Settings</h1>

        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <p className="text-sm text-gray-500">
            Monthly ROI is credited every <strong>{form.cycleDays} days</strong> from the investment start date. The current rate is applied to all active investments.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Minimum ROI Rate (%)</label>
              <input
                type="number" step="0.01" min="0" max="100"
                value={form.minRate}
                onChange={(e) => set("minRate", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Maximum ROI Rate (%)</label>
              <input
                type="number" step="0.01" min="0" max="100"
                value={form.maxRate}
                onChange={(e) => set("maxRate", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Current Active ROI Rate (%)</label>
            <input
              type="number" step="0.01" min="0" max="100"
              value={form.currentRate}
              onChange={(e) => set("currentRate", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">Must be between {form.minRate}% and {form.maxRate}%</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">ROI Cycle (Days)</label>
            <input
              type="number" step="1" min="1"
              value={form.cycleDays}
              onChange={(e) => set("cycleDays", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">Default is 30 days (monthly). ROI is credited this many days after each investment/top-up.</p>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save size={15} /> Save ROI Settings
          </button>
        </form>
      </div>
    </div>
  );
}
