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
  const [documentFrontUrl, setDocumentFrontUrl] = useState("");
  const [documentBackUrl, setDocumentBackUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFrontUrl) return;

    submitKyc({
      documentType,
      documentNumber,
      documentFrontUrl,
      documentBackUrl,
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-zinc-500">Loading KYC status...</div>
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
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              KYC Verification
            </h1>
            <p className="text-sm text-zinc-400">
              View your current KYC status
            </p>
          </div>
        </div>

        <div
          className={`border rounded-2xl p-8 flex flex-col items-center justify-center text-center ${
            isVerified
              ? "border-green-500/30 bg-green-500/5"
              : isRejected
                ? "border-red-500/30 bg-red-500/5"
                : "border-yellow-500/30 bg-yellow-500/5"
          }`}
        >
          {isVerified && (
            <CheckCircle2 size={48} className="text-green-500 mb-4" />
          )}
          {isPending && <FileText size={48} className="text-yellow-500 mb-4" />}
          {isRejected && (
            <AlertCircle size={48} className="text-red-500 mb-4" />
          )}

          <h2 className="text-xl font-bold text-white mb-2">
            {isVerified
              ? "Verification Successful"
              : isPending
                ? "Verification Pending"
                : "Verification Rejected"}
          </h2>
          <p className="text-zinc-400 mb-6 max-w-md">
            {isVerified
              ? "Your identity has been verified. You now have full access to all features."
              : isPending
                ? "Your documents are currently under review by our admin team. This usually takes 1-2 business days."
                : `Your KYC submission was rejected. Reason: ${kycStatus.adminRemarks || "Invalid documents."}`}
          </p>

          {isRejected && (
            <button
              onClick={() => window.location.reload()} // Just refresh to let them try again (if you add logic to let them resubmit)
              className="px-6 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg transition-colors"
            >
              Contact Support
            </button>
          )}
        </div>
      </div>
    );
  }

  // If no KYC exists, show form
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            KYC Verification
          </h1>
          <p className="text-sm text-zinc-400">
            Submit your documents to verify your identity
          </p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="Passport">Passport</option>
                <option value="National ID">National ID Card</option>
                <option value="Driver's License">Driver's License</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">
                Document Number (Optional)
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. A12345678"
                className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">
              Document Front Image URL *
            </label>
            <div className="relative">
              <UploadCloud
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="url"
                required
                value={documentFrontUrl}
                onChange={(e) => setDocumentFrontUrl(e.target.value)}
                placeholder="https://example.com/front-id.jpg"
                className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">
              Document Back Image URL (Optional)
            </label>
            <div className="relative">
              <UploadCloud
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="url"
                value={documentBackUrl}
                onChange={(e) => setDocumentBackUrl(e.target.value)}
                placeholder="https://example.com/back-id.jpg"
                className="w-full bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? "Submitting..." : "Submit Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
