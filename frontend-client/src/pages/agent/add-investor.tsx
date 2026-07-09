import React, { useState } from "react";
import { UserPlus } from "lucide-react";

export default function AddInvestor() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating investor:", formData);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
          <UserPlus size={20} />
        </div>
        <h1 className="text-xl font-semibold text-white tracking-wide">
          Add New Investor
        </h1>
      </div>

      <div className="max-w-2xl bg-[#141414] border border-[#222] rounded-xl p-6 sm:p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-400">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange("firstName")}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="John"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-400">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange("lastName")}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-zinc-400">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={handleChange("email")}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-zinc-400">Mobile Number</label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={handleChange("mobile")}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-zinc-400">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={handleChange("password")}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="••••••••"
            />
            <p className="text-xs text-zinc-500 mt-1">This password will be used by the investor to log in.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-orange-500/20 transition-all"
            >
              Register Investor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
