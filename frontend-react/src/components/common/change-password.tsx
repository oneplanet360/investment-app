import React, { useState } from "react";

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
        className="relative p-px bg-orange-600 transition-colors focus-within:bg-orange-500"
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

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    console.log("Changing password:", formData);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-xl font-semibold text-white tracking-wide">
        Change Password
      </h1>

      <div className="max-w-4xl bg-[#141414] border border-[#222] rounded-xl p-6 sm:p-10 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8 relative">
          
          {/* Form Fields Grid */}
          <div className="flex flex-col gap-6 max-w-xl">
            <HexInput
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange("currentPassword")}
              required
            />
            <HexInput
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
              required
            />
            <HexInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 max-w-xl">
            <button
              type="submit"
              className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99]"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
