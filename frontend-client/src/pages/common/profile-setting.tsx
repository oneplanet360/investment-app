import React, { useState } from "react";
import { User, Image as ImageIcon } from "lucide-react";

// A custom input component with the sci-fi chamfered corners
function HexInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  readOnly = false,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-zinc-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Outer border wrapper with orange color and clip-path */}
      <div
        className="relative p-[1px] bg-orange-600 transition-colors focus-within:bg-orange-500"
        style={{
          clipPath:
            "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
        }}
      >
        {/* Inner background to simulate the border */}
        <div
          className="bg-[#1a120e] relative flex items-center transition-colors focus-within:bg-[#201511]"
          style={{
            clipPath:
              "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          }}
        >
          <input
            type={type}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            placeholder={placeholder}
            className={`w-full bg-transparent text-sm text-zinc-200 px-4 py-3 outline-none ${
              readOnly ? "text-zinc-500 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProfileSetting() {
  const [formData, setFormData] = useState({
    firstName: "Britanney",
    lastName: "Gomezhgg",
    address: "Duis voluptatem Nam",
    state: "Aut qui et et non ne",
    zipCode: "89161",
    city: "Porro quidem dolor f",
    country: "Samoa",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    console.log("Saving profile:", formData);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-xl font-semibold text-white tracking-wide">
        Profile Setting
      </h1>

      <div className="max-w-4xl bg-[#141414] border border-[#222] rounded-xl p-6 sm:p-10 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8 relative">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center pt-2 pb-6 border-b border-[#2a2a2a]">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-orange-500 flex items-center justify-center bg-[#ddd] overflow-hidden">
                <User size={80} className="text-white translate-y-4" />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white border-2 border-[#141414] hover:bg-orange-600 transition-colors"
              >
                <ImageIcon size={14} />
              </button>
            </div>
            <p className="text-orange-600 text-xs font-medium mt-4">
              Image size: 350x300 | Allowed Extensions: jpg, jpeg, png
            </p>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HexInput
              label="First Name"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              required
            />
            <HexInput
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              required
            />
            <HexInput
              label="E-mail Address"
              value="[Email is protected for the demo]"
              readOnly
            />
            <HexInput
              label="Mobile Number"
              value="[Mobile is protected for the demo]"
              readOnly
            />
            <HexInput
              label="Address"
              value={formData.address}
              onChange={handleChange("address")}
            />
            <HexInput
              label="State"
              value={formData.state}
              onChange={handleChange("state")}
            />
          </div>

          {/* Bottom row with 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HexInput
              label="Zip Code"
              value={formData.zipCode}
              onChange={handleChange("zipCode")}
            />
            <HexInput
              label="City"
              value={formData.city}
              onChange={handleChange("city")}
            />
            <HexInput
              label="Country"
              value={formData.country}
              onChange={handleChange("country")}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
