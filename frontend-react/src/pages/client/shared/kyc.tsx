import { useState } from "react";
import {
  ShieldCheck,
  UploadCloud,
  AlertCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import {
  useSubmitClientKyc,
  useClientKycStatusQuery,
} from "../../../services/client/clientKyc/clientKyc.queries";
import { useClientVerifyUser } from "../../../services/client/clientAuth/clientAuth.query";

export default function KYC() {
  useClientVerifyUser();
  const { data: kycStatus, isLoading } = useClientKycStatusQuery();
  const { mutate: submitKyc, isPending } = useSubmitClientKyc();

  const [documentType, setDocumentType] = useState("Passport");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFront) return;

    const formData = new FormData();
    formData.append('documentType', documentType);
    if (documentNumber) formData.append('documentNumber', documentNumber);
    formData.append('documentFront', documentFront);
    if (documentBack) formData.append('documentBack', documentBack);

    submitKyc(formData as any);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-client-text-secondary">Loading KYC status...</div>
    );
  }

  // If KYC exists (PENDING, VERIFIED, or REJECTED)
  if (kycStatus) {
    const isPending = kycStatus.status === "PENDING";
    const isVerified = kycStatus.status === "APPROVED";
    const isRejected = kycStatus.status === "REJECTED";

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-client-bg-secondary flex items-center justify-center text-brand-primary">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-client-text tracking-tight">
              KYC Verification
            </h1>
            <p className="text-sm text-client-text-secondary">
              View your current KYC status
            </p>
          </div>
        </div>

        <div
          className={`relative overflow-hidden border rounded-3xl p-10 flex flex-col items-center justify-center text-center backdrop-blur-xl transition-all duration-500 ${
            isVerified
              ? "border-green-500/40 bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.15)]"
              : isRejected
                ? "border-client-error/40 bg-client-error/10 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
                : "border-yellow-500/40 bg-yellow-500/10 shadow-[0_0_40px_rgba(234,179,8,0.15)]"
          }`}
        >
          {/* Decorative Background Blob */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none ${
            isVerified ? "bg-green-500" : isRejected ? "bg-client-error" : "bg-yellow-500"
          }`}></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`p-4 rounded-full mb-6 ${
              isVerified ? "bg-green-500/20 text-green-500" : isRejected ? "bg-client-error/20 text-client-error" : "bg-yellow-500/20 text-yellow-500"
            }`}>
              {isVerified && <CheckCircle2 size={56} className="animate-in zoom-in duration-500" />}
              {isPending && <FileText size={56} className="animate-pulse" />}
              {isRejected && <AlertCircle size={56} className="animate-bounce" />}
            </div>

            <h2 className={`text-2xl font-extrabold tracking-tight mb-3 ${
              isVerified ? "text-green-500" : isRejected ? "text-client-error" : "text-yellow-500"
            }`}>
              {isVerified
                ? "Verification Successful"
                : isPending
                  ? "Verification Pending"
                  : "Verification Rejected"}
            </h2>
            <p className="text-client-text-secondary text-sm mb-8 max-w-sm leading-relaxed">
              {isVerified
                ? "Your identity has been verified. You now have full access to all premium features on the platform."
                : isPending
                  ? "Your documents are currently under review by our team. This usually takes 1-2 business days."
                  : `Your KYC submission was rejected. Reason: ${kycStatus.adminRemarks || "Invalid documents provided."}`}
            </p>

            {isRejected && (
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-client-error/10 hover:bg-client-error/20 text-client-error font-semibold rounded-xl transition-colors border border-client-error/20 active:scale-[0.98]"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If no KYC exists, show form
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-client-bg-secondary flex items-center justify-center text-brand-primary">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-client-text tracking-tight">
            KYC Verification
          </h1>
          <p className="text-sm text-client-text-secondary">
            Submit your documents to verify your identity
          </p>
        </div>
      </div>

      <div className="bg-client-card border border-client-border rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-client-text-secondary">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-client-card border border-client-border rounded-xl px-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors"
              >
                <option value="Passport">Passport</option>
                <option value="National ID">National ID Card</option>
                <option value="Driver's License">Driver's License</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-client-text-secondary">
                Document Number (Optional)
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. A12345678"
                className="w-full bg-client-card border border-client-border rounded-xl px-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-client-text-secondary">
              Document Front Image *
            </label>
            <div className="relative">
              <UploadCloud
                className="absolute left-3 top-1/2 -translate-y-1/2 text-client-text-secondary"
                size={18}
              />
              <input
                type="file"
                accept="image/*,application/pdf"
                required
                onChange={(e) => setDocumentFront(e.target.files?.[0] || null)}
                className="w-full bg-client-card border border-client-border rounded-xl pl-10 pr-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-client-bg-secondary file:text-brand-primary hover:file:bg-brand-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-client-text-secondary">
              Document Back Image (Optional)
            </label>
            <div className="relative">
              <UploadCloud
                className="absolute left-3 top-1/2 -translate-y-1/2 text-client-text-secondary"
                size={18}
              />
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setDocumentBack(e.target.files?.[0] || null)}
                className="w-full bg-client-card border border-client-border rounded-xl pl-10 pr-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-client-bg-secondary file:text-brand-primary hover:file:bg-brand-primary/20"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 bg-brand-primary hover:bg-brand-hover text-client-text font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? "Submitting..." : "Submit Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
