import { useState } from "react";
import { Eye, EyeOff, Lock, User, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up auth
  }

  return (
    <div className="min-h-screen bg-[#0a1535] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 border border-[#1e3a6e]/40 rounded-2xl rotate-12 opacity-50" />
        <div className="absolute top-32 left-24 w-20 h-20 border border-[#2a4a8e]/30 rounded-xl rotate-45 opacity-40" />
        <div className="absolute bottom-16 right-12 w-56 h-56 border border-[#1e3a6e]/30 rounded-3xl -rotate-12 opacity-40" />
        <div className="absolute bottom-40 right-32 w-24 h-24 border border-[#3b5fc0]/20 rounded-xl rotate-6 opacity-30" />
        <div className="absolute top-1/2 left-6 w-16 h-16 border border-[#2a4a8e]/20 rounded-lg -rotate-12 opacity-30" />
        <div className="absolute top-1/4 right-8 w-32 h-32 border border-[#1e3a6e]/25 rounded-2xl rotate-20 opacity-35" />
      </div>

      <div className="relative w-full max-w-115">
        {/* Card */}
        <div className="bg-[#0d1e45] rounded-2xl shadow-2xl overflow-hidden border border-[#1e3a6e]/50">

          {/* Header band */}
          <div className="bg-linear-to-r from-[#2a4aad] to-[#3b5fc0] px-8 py-7 text-center relative">
            {/* Shield icon */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/15 mb-3 ring-2 ring-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Admin Portal</h1>
            <p className="text-white/70 text-sm mt-1">Sign in to your dashboard</p>

            {/* Bottom notch */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#2a4aad] rotate-45 rounded-sm" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pt-10 pb-8 space-y-5">

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                  className="w-full bg-[#0a1535] border border-[#1e3a6e]/60 text-white placeholder-white/25
                    rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none
                    focus:border-[#3b5fc0] focus:ring-1 focus:ring-[#3b5fc0]/40 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#0a1535] border border-[#1e3a6e]/60 text-white placeholder-white/25
                    rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none
                    focus:border-[#3b5fc0] focus:ring-1 focus:ring-[#3b5fc0]/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-[#3b5fc0] cursor-pointer"
              />
              <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors select-none">
                Remember me
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-[#2a4aad] to-[#3b5fc0] hover:from-[#3355c0] hover:to-[#4a6fd0]
                text-white font-semibold text-sm tracking-widest uppercase rounded-lg py-3
                transition-all duration-200 shadow-lg shadow-[#2a4aad]/30 mt-1
                active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/25 text-xs mt-5">
          Protected admin area &mdash; unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
}