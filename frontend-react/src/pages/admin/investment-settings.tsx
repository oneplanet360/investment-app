import { useState } from "react";
import {
  systemSettings,
  roiSettings,
  commissionSettings,
} from "../../lib/data";
import { toast } from "sonner";
import {
  Save,
  Globe,
  TrendingUp,
  Users,
  ShieldCheck,
  Landmark,
  PlusCircle,
  Trash2,
} from "lucide-react";

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <span className="text-indigo-500">{icon}</span>
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-0.5">
      {label}
    </label>
    {desc && <p className="text-xs text-gray-400 mb-1.5">{desc}</p>}
    {children}
  </div>
);

export default function InvestmentSettings() {
  const [sys, setSys] = useState({ ...systemSettings });
  const [roi, setRoi] = useState({ ...roiSettings });
  const [com, setCom] = useState([...commissionSettings]);

  const setSysField = (k: keyof typeof sys, v: string | boolean) =>
    setSys((p) => ({
      ...p,
      [k]:
        typeof v === "boolean"
          ? v
          : isNaN(Number(v))
            ? v
            : k === "minInvestment" ||
                k === "maxInvestment" ||
                k === "withdrawalPerMonth"
              ? Number(v)
              : v,
    }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully.");
  };

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors";

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6">
      <h1 className="text-base font-semibold text-gray-700 mb-5">
        Investment Settings
      </h1>

      <form onSubmit={handleSave} className="space-y-5 w-full">
        {/* General */}
        <Section icon={<Globe size={16} />} title="General Settings">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Site Name">
              <input
                className={inputCls}
                value={sys.siteName}
                onChange={(e) => setSysField("siteName", e.target.value)}
              />
            </Field>
            <Field label="Admin Email">
              <input
                className={inputCls}
                type="email"
                value={sys.siteEmail}
                onChange={(e) => setSysField("siteEmail", e.target.value)}
              />
            </Field>
            <Field label="Currency">
              <input
                className={inputCls}
                value={sys.currency}
                onChange={(e) => setSysField("currency", e.target.value)}
              />
            </Field>
            <Field label="Currency Symbol">
              <input
                className={inputCls}
                value={sys.currencySymbol}
                onChange={(e) => setSysField("currencySymbol", e.target.value)}
              />
            </Field>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Maintenance Mode
              </p>
              <p className="text-xs text-gray-400">
                Disable user access to the platform
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSysField("maintenanceMode", !sys.maintenanceMode)
              }
              className={`relative w-10 h-5 rounded-full transition-colors ${sys.maintenanceMode ? "bg-red-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${sys.maintenanceMode ? "left-5" : "left-0.5"}`}
              />
            </button>
          </div>
        </Section>

        {/* Investment Limits */}
        <Section icon={<Landmark size={16} />} title="Investment Limits">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Minimum Investment (USD)"
              desc="Minimum amount an investor can invest"
            >
              <input
                className={inputCls}
                type="number"
                min="0"
                value={sys.minInvestment}
                onChange={(e) => setSysField("minInvestment", e.target.value)}
              />
            </Field>
            <Field
              label="Maximum Investment (USD)"
              desc="Maximum amount per investment"
            >
              <input
                className={inputCls}
                type="number"
                min="0"
                value={sys.maxInvestment}
                onChange={(e) => setSysField("maxInvestment", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        {/* ROI Settings */}
        <Section icon={<TrendingUp size={16} />} title="ROI Settings">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Min ROI Rate (%)">
              <input
                className={inputCls}
                type="number"
                step="0.01"
                min="0"
                value={roi.minRate}
                onChange={(e) =>
                  setRoi((p) => ({ ...p, minRate: +e.target.value }))
                }
              />
            </Field>
            <Field label="Max ROI Rate (%)">
              <input
                className={inputCls}
                type="number"
                step="0.01"
                min="0"
                value={roi.maxRate}
                onChange={(e) =>
                  setRoi((p) => ({ ...p, maxRate: +e.target.value }))
                }
              />
            </Field>
            <Field label="Current Rate (%)">
              <input
                className={inputCls}
                type="number"
                step="0.01"
                min="0"
                value={roi.currentRate}
                onChange={(e) =>
                  setRoi((p) => ({ ...p, currentRate: +e.target.value }))
                }
              />
            </Field>
            <Field label="Cycle Days" desc="Days between ROI credits">
              <input
                className={inputCls}
                type="number"
                min="1"
                value={roi.cycleDays}
                onChange={(e) =>
                  setRoi((p) => ({ ...p, cycleDays: +e.target.value }))
                }
              />
            </Field>
          </div>
        </Section>

        {/* Commission Settings */}
        <Section icon={<Users size={16} />} title="Agent Commission Rates">
          <div className="flex flex-col gap-4">
            {com.map((levelObj, index) => (
              <div key={index} className="flex items-end gap-4">
                <div className="flex-1">
                  <Field label={`Level ${levelObj.level} (%)`}>
                    <input
                      className={inputCls}
                      type="number"
                      step="0.01"
                      min="0"
                      value={levelObj.percentage}
                      onChange={(e) => {
                        const newCom = [...com];
                        newCom[index].percentage = +e.target.value;
                        setCom(newCom);
                      }}
                    />
                  </Field>
                </div>
                {index === com.length - 1 && index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newCom = [...com];
                      newCom.pop();
                      setCom(newCom);
                    }}
                    className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                setCom([...com, { level: com.length + 1, percentage: 0 }]);
              }}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 w-fit"
            >
              <PlusCircle size={16} /> Add Next Level
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-4">
            Total:{" "}
            <strong>
              {com.reduce((acc, curr) => acc + curr.percentage, 0).toFixed(2)}%
            </strong>{" "}
            (target: 4.00%)
          </p>
        </Section>

        {/* KYC & Withdrawal Rules */}
        <Section
          icon={<ShieldCheck size={16} />}
          title="KYC & Withdrawal Rules"
        >
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">KYC Required</p>
              <p className="text-xs text-gray-400">
                Investors and agents must complete KYC before investing or
                withdrawing
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSysField("kycRequired", !sys.kycRequired)}
              className={`relative w-10 h-5 rounded-full transition-colors ${sys.kycRequired ? "bg-indigo-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${sys.kycRequired ? "left-5" : "left-0.5"}`}
              />
            </button>
          </div>
          <Field
            label="Max Withdrawals Per Month"
            desc="Both investors and agents are limited to this many withdrawal requests per month"
          >
            <input
              className={inputCls}
              type="number"
              min="1"
              value={sys.withdrawalPerMonth}
              onChange={(e) =>
                setSysField("withdrawalPerMonth", e.target.value)
              }
            />
          </Field>
        </Section>

        <button
          type="submit"
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Save size={15} /> Save All Settings
        </button>
      </form>
    </div>
  );
}
