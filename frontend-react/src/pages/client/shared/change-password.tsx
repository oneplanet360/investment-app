import { useState } from "react";
import { Lock, Save, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { updateClientPasswordFn } from "../../../services/client/clientProfile/clientProfile.api";
import { toast } from "sonner";

export default function ChangePassword() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const toggleShow = (field: 'old' | 'new' | 'confirm') => {
    setShowPassword(p => ({ ...p, [field]: !p[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await updateClientPasswordFn({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Password updated successfully");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update password",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 mt-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-4 shadow-inner shadow-brand-primary/5">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-client-text">
          Security Settings
        </h2>
        <p className="text-sm text-client-text-secondary mt-2 max-w-sm mx-auto">
          Update your password regularly to ensure your account remains secure and protected.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-b from-brand-primary/20 to-transparent rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative bg-client-card border border-client-border rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-client-text-secondary ml-1">
                Current Password
              </label>
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword.old ? "text" : "password"}
                  name="oldPassword"
                  required
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-11 py-3 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => toggleShow('old')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary hover:text-brand-primary transition-colors"
                >
                  {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="border-t border-client-border/50 pt-2 pb-2"></div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-client-text-secondary ml-1">
                New Password
              </label>
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-11 py-3 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => toggleShow('new')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary hover:text-brand-primary transition-colors"
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-client-text-secondary ml-1">
                Confirm New Password
              </label>
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-11 py-3 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => toggleShow('confirm')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary hover:text-brand-primary transition-colors"
                >
                  {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-brand-primary hover:bg-brand-hover active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-client-text shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Update Password
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
