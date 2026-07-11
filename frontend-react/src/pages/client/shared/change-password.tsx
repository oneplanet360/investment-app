import { useState } from "react";
import { Key, Save, Loader2 } from "lucide-react";
import { updateClientPasswordFn } from "../../../services/client/clientProfile/clientProfile.api";
import { toast } from "sonner";

export default function ChangePassword() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Change Password
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Update your password to keep your account secure.
        </p>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Current Password
            </label>
            <div className="relative">
              <Key
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                size={16}
              />
              <input
                type="password"
                name="oldPassword"
                required
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              New Password
            </label>
            <div className="relative">
              <Key
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                size={16}
              />
              <input
                type="password"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Confirm New Password
            </label>
            <div className="relative">
              <Key
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                size={16}
              />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 py-2.5 px-6 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-white shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
