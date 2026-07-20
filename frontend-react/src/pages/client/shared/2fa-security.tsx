import { Shield, Smartphone, Loader2 } from "lucide-react";
import { useState } from "react";

export default function TwoFASecurity() {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    setLoading(true);
    setTimeout(() => {
      setEnabled(!enabled);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-client-text">
          2FA Security
        </h2>
        <p className="text-sm text-client-text-secondary mt-1">
          Add an extra layer of security to your account using Two-Factor
          Authentication.
        </p>
      </div>

      <div className="bg-client-card border border-client-border rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-client-bg-secondary flex items-center justify-center text-brand-primary shrink-0">
            <Shield size={32} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-client-text mb-2">
              Authenticator App
            </h3>
            <p className="text-sm text-client-text-secondary mb-6">
              Use an authenticator app like Google Authenticator or Authy to
              generate one-time security codes.
            </p>

            <button
              onClick={handleToggle}
              disabled={loading}
              className={`flex items-center justify-center md:justify-start gap-2 py-2.5 px-6 rounded-xl text-sm font-bold transition-all w-full md:w-auto disabled:opacity-50
                ${
                  enabled
                    ? "bg-client-error/10 text-client-error hover:bg-client-error/20"
                    : "bg-brand-primary hover:bg-brand-hover active:scale-[0.98] text-client-text shadow-lg shadow-brand-primary/20"
                }`}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : enabled ? (
                "Disable 2FA"
              ) : (
                <>
                  <Smartphone size={16} />
                  <span>Enable 2FA</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
