import { useState } from "react";
import {
  ShieldCheck,
  UploadCloud,
  AlertCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import {
  useSubmitClientNominee,
  useClientNomineeStatusQuery,
} from "../../../services/client/clientNominee/clientNominee.queries";
import { useClientVerifyUser } from "../../../services/client/clientAuth/clientAuth.query";

export default function Nominee() {
  useClientVerifyUser();
  const { data: nomineeStatus, isLoading } = useClientNomineeStatusQuery();
  const { mutate: submitNominee, isPending } = useSubmitClientNominee();

  const [nomineeName, setNomineeName] = useState("");
  const [relation, setRelation] = useState("");
  const [documentType, setDocumentType] = useState("Passport");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFront || !nomineeName || !relation) return;

    const formData = new FormData();
    formData.append('nomineeName', nomineeName);
    formData.append('relation', relation);
    formData.append('documentType', documentType);
    if (documentNumber) formData.append('documentNumber', documentNumber);
    formData.append('documentFront', documentFront);
    if (documentBack) formData.append('documentBack', documentBack);

    submitNominee(formData as any);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-client-text-secondary">Loading Nominee status...</div>
    );
  }

  // If Nominee exists (PENDING, VERIFIED, or REJECTED)
  if (nomineeStatus) {
    const isPending = nomineeStatus.status === "PENDING";
    const isVerified = nomineeStatus.status === "APPROVED";
    const isRejected = nomineeStatus.status === "REJECTED";

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-client-bg-secondary flex items-center justify-center text-brand-primary">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-client-text tracking-tight">
              Nominee Verification
            </h1>
            <p className="text-sm text-client-text-secondary">
              View your current Nominee Verification status
            </p>
          </div>
        </div>

        <div
          className={`border rounded-2xl p-8 flex flex-col items-center justify-center text-center ${
            isVerified
              ? "border-green-500/30 bg-green-500/5"
              : isRejected
                ? "border-client-error/30 bg-client-error/5"
                : "border-yellow-500/30 bg-yellow-500/5"
          }`}
        >
          {isVerified && (
            <CheckCircle2 size={48} className="text-green-500 mb-4" />
          )}
          {isPending && <FileText size={48} className="text-yellow-500 mb-4" />}
          {isRejected && (
            <AlertCircle size={48} className="text-client-error mb-4" />
          )}

          <h2 className="text-xl font-bold text-client-text mb-2">
            {isVerified
              ? "Verification Successful"
              : isPending
                ? "Verification Pending"
                : "Verification Rejected"}
          </h2>
          <p className="text-client-text-secondary mb-6 max-w-md">
            {isVerified
              ? "Your nominee details have been verified."
              : isPending
                ? "Your nominee documents are currently under review by our admin team."
                : `Your nominee submission was rejected. Reason: ${nomineeStatus.adminRemarks || "Invalid documents."}`}
          </p>

          {isRejected && (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-client-card hover:bg-[#333] text-client-text rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // If no Nominee exists, show form
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-client-bg-secondary flex items-center justify-center text-brand-primary">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-client-text tracking-tight">
            Nominee Verification
          </h1>
          <p className="text-sm text-client-text-secondary">
            Submit your nominee details and documents
          </p>
        </div>
      </div>

      <div className="bg-client-card border border-client-border rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-client-text-secondary">
                Nominee Name *
              </label>
              <input
                type="text"
                value={nomineeName}
                required
                onChange={(e) => setNomineeName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-client-card border border-client-border rounded-xl px-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-client-text-secondary">
                Relation with Nominee *
              </label>
              <input
                type="text"
                value={relation}
                required
                onChange={(e) => setRelation(e.target.value)}
                placeholder="e.g. Spouse, Sibling"
                className="w-full bg-client-card border border-client-border rounded-xl px-4 py-3 text-sm text-client-text focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
          </div>

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
