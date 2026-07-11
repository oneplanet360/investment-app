import { useState, useEffect } from "react";
import { User, Phone, MapPin, Save, Loader2 } from "lucide-react";
import {
  getClientProfileFn,
  updateClientProfileFn,
} from "../../../services/client/clientProfile/clientProfile.api";
import { toast } from "sonner";

export default function ProfileSetting() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    country: "",
    city: "",
    address: "",
    zip: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await getClientProfileFn();
        if (user) {
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            mobile: user.mobile || "",
            country: user.country || "",
            city: user.city || "",
            address: user.address || "",
            zip: user.zip || "",
          });
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateClientProfileFn(formData);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Profile Settings
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your personal information and contact details.
        </p>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                First Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                  placeholder="Enter first name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Last Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Mobile Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Country
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">City</label>
              <div className="relative">
                <MapPin
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Zip / Postal Code
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                  placeholder="Enter zip code"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-zinc-300">
                Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3.5 top-3.5 text-zinc-500"
                  size={16}
                />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => handleChange(e)}
                  rows={3}
                  className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-all"
                  placeholder="Enter full address"
                />
              </div>
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
