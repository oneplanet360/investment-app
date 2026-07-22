import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useClientSignIn } from "../../../services/client/clientAuth/clientAuth.query";

export default function ClientSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: signIn, isPending } = useClientSignIn();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    signIn({ email, password });
  };

  return (
    <div className="flex min-h-screen bg-[#0b0b0b] text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Left Side: Image / Graphics (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-[#141414] items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-orange-600/10 blur-3xl pointer-events-none" />

        {/* Abstract Image or Pattern */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")' }}
        />

        <div className="relative z-10 p-12 text-center max-w-lg">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Welcome Back</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Manage your investments, track your performance, and grow your portfolio with our advanced platform.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-brand-primary">
        {/* Subtle right-side gradients for flair */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-dark/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10 text-white">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>
            <p className="text-white/80 mt-2">Enter your credentials to access your account</p>
          </div>

          {/* Card Panel */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-primary transition-all font-sans"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-11 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-primary transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-hover disabled:opacity-50 text-sm font-bold text-white rounded-xl shadow-lg shadow-brand-primary/20 active:scale-[0.99] transition-all duration-200"
                >
                  {isPending ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}