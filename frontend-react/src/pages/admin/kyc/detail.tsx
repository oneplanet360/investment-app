import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  FileText,
  MapPin,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useKycDetailQuery } from "../../../services/admin/adminKyc/adminKyc.query";
import { useUpdateKycStatusMutation } from "../../../services/admin/adminKyc/adminKyc.mutation";

const statusStyle: Record<string, string> = {
  PENDING: "text-yellow-600 bg-yellow-50 border-yellow-400",
  APPROVED: "text-green-600 bg-green-50 border-green-500",
  REJECTED: "text-red-500 bg-red-50 border-red-400",
  UNVERIFIED: "text-gray-500 bg-gray-50 border-gray-400",
};

function fmt(d: string) {
  return new Date(d)
    .toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

export default function KycDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: kyc, isLoading, error } = useKycDetailQuery(id || "");
  const { mutate: updateStatus, isPending } = useUpdateKycStatusMutation();

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <Loader2 size={24} className="animate-spin text-indigo-500" />
        <p className="text-gray-500 text-sm">Loading KYC details...</p>
      </div>
    );
  }

  if (error || !kyc) {
    return (
      <div className="min-h-full bg-[var(--theme-bg)] p-6 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">
          KYC submission not found or failed to load.
        </p>
        <Link
          to="/admin/kyc/all"
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to KYC
        </Link>
      </div>
    );
  }

  const handleApprove = () => {
    updateStatus(
      { id: kyc._id, status: "APPROVED" },
      {
        onSuccess: () => {
          setShowRejectForm(false);
        },
      },
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    updateStatus(
      { id: kyc._id, status: "REJECTED", remarks: rejectReason },
      {
        onSuccess: () => {
          setShowRejectForm(false);
        },
      },
    );
  };

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/kyc/all"
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 className="text-base font-semibold text-gray-700">KYC Review</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-gray-700">User Info</h2>
          </div>
          <div className="divide-y divide-gray-50 text-sm">
            {[
              ["Full Name", kyc.userId.name],
              ["Username", `@${kyc.userId.username}`],
              ["User Type", kyc.userId.role.toLowerCase()],
              ["Country", kyc.userId.country || "—"],
              ["Address", kyc.userId.address || "—"],
              ["Submitted", fmt(kyc.createdAt)],
              ...(kyc.status !== "PENDING"
                ? [["Reviewed", fmt(kyc.updatedAt)]]
                : []),
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between py-2.5 gap-2"
              >
                <span className="text-gray-500 shrink-0">{label}</span>
                <span className="font-medium text-gray-800 text-right capitalize">
                  {value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Status</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium border ${statusStyle[kyc.status] || statusStyle.UNVERIFIED}`}
              >
                {kyc.status.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Document Info */}
        <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-gray-700">
              Document Info
            </h2>
          </div>
          <div className="divide-y divide-gray-50 text-sm">
            {[
              ["Document Type", kyc.documentType],
              ["Document Number", kyc.documentNumber || "—"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between py-2.5 gap-2"
              >
                <span className="text-gray-500 shrink-0">{label}</span>
                <span className="font-medium text-gray-800 font-mono text-xs text-right">
                  {value}
                </span>
              </div>
            ))}
            {kyc.adminRemarks && (
              <div className="py-2.5">
                <p className="text-gray-500 mb-1">Rejection Reason / Remarks</p>
                <p className="text-red-500 text-xs bg-red-50 rounded p-2">
                  {kyc.adminRemarks}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {kyc.status === "PENDING" && (
            <div className="pt-2 space-y-2">
              <button
                onClick={handleApprove}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Approve KYC
              </button>
              <button
                onClick={() => setShowRejectForm((p) => !p)}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-300 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <XCircle size={16} /> Reject KYC
              </button>
              {showRejectForm && (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-red-400 resize-none"
                  />
                  <button
                    onClick={handleReject}
                    disabled={isPending}
                    className="w-full bg-red-600 flex items-center justify-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isPending && (
                      <Loader2 size={15} className="animate-spin" />
                    )}
                    Confirm Rejection
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-gray-700">
              Document Images
            </h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">
                Front Side
              </p>
              <img
                src={kyc.documentFrontUrl}
                alt="Document Front"
                className="w-full rounded-lg border border-gray-100 object-cover"
              />
            </div>
            {kyc.documentBackUrl && (
              <div>
                <p className="text-xs text-gray-500 mb-1.5 font-medium">
                  Back Side
                </p>
                <img
                  src={kyc.documentBackUrl}
                  alt="Document Back"
                  className="w-full rounded-lg border border-gray-100 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
