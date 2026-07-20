import { useState, useEffect } from "react";
import { User, Phone, MapPin, Save, Loader2, Globe, Building, Map } from "lucide-react";
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
      <div className="flex justify-center items-center h-64 text-brand-primary">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mt-2 mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-client-text">
          Profile Settings
        </h2>
        <p className="text-sm text-client-text-secondary mt-2 max-w-lg mx-auto">
          Manage your personal information and contact details. Keeping this up to date helps us serve you better.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Information Section */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-client-card border border-client-border rounded-2xl p-5 md:p-6 shadow-sm">
            <h3 className="text-lg font-bold text-client-text mb-4 flex items-center gap-2">
              <User size={20} className="text-brand-primary" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-client-text-secondary ml-1">
                  First Name
                </label>
                <div className="relative group/input">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                    placeholder="Enter first name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-client-text-secondary ml-1">
                  Last Name
                </label>
                <div className="relative group/input">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-client-text-secondary ml-1">
                  Mobile Number
                </label>
                <div className="relative group/input">
                  <Phone
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-bl from-brand-primary/10 to-transparent rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-client-card border border-client-border rounded-2xl p-5 md:p-6 shadow-sm">
            <h3 className="text-lg font-bold text-client-text mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-brand-primary" />
              Location Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-client-text-secondary ml-1">
                  Country
                </label>
                <div className="relative group/input">
                  <Globe
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                    placeholder="Enter country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-client-text-secondary ml-1">City</label>
                <div className="relative group/input">
                  <Building
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-client-text-secondary ml-1">
                  Zip / Postal Code
                </label>
                <div className="relative group/input">
                  <Map
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50"
                    placeholder="Enter zip code"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-client-text-secondary ml-1">
                  Address
                </label>
                <div className="relative group/input">
                  <MapPin
                    className="absolute left-3.5 top-3.5 text-client-text-secondary group-focus-within/input:text-brand-primary transition-colors"
                    size={18}
                  />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >,
                    ) => handleChange(e)}
                    rows={2}
                    className="w-full bg-client-bg/50 border border-client-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all hover:border-brand-primary/50 resize-none"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 py-2.5 px-8 bg-brand-primary hover:bg-brand-hover active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-client-text shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10 flex items-center gap-2">
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
