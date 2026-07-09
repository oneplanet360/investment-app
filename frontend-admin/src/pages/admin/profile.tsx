import React from "react";
import { Link } from "react-router-dom";
import { KeyRound, UploadCloud, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminProfileQuery } from "../../services/adminProfile/adminProfile.query";
import { useUpdateAdminProfileMutation } from "../../services/adminProfile/adminProfile.mutation";
import type { AdminProfilePayload } from "../../services/adminProfile/adminProfile.types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  avatarUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Profile() {
  const fileRef = React.useRef<HTMLInputElement>(null);
  
  const { data: profile, isLoading } = useAdminProfileQuery();
  const { mutate: updateProfile, isPending } = useUpdateAdminProfileMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: profile
      ? {
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl || "",
        }
      : undefined,
  });

  const formValues = useWatch({ control });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setValue("avatarUrl", base64Str, { shouldValidate: true, shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormData) => {
    updateProfile(data as AdminProfilePayload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-700">Profile</h1>
        <Link
          to="/password"
          className="flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-400 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors"
        >
          <KeyRound size={13} />
          Password Setting
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-65 shrink-0">
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="bg-indigo-600 px-5 py-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                {formValues.avatarUrl ? (
                  <img src={formValues.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-white font-semibold text-base">{formValues.name || profile?.name}</span>
            </div>
            <div className="bg-white divide-y divide-gray-100">
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-semibold text-indigo-700">{formValues.name || profile?.name}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-indigo-500 font-medium">Email</span>
                <span className="text-gray-700 truncate w-32 text-right">{formValues.email || profile?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 bg-white rounded-lg shadow-sm p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-5">Profile Information</h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="shrink-0">
              <p className="text-sm text-gray-500 mb-2">Image</p>
              <div
                className="relative w-full sm:w-55 h-55 border border-gray-200 rounded-md overflow-hidden cursor-pointer group"
                onClick={() => fileRef.current?.click()}
              >
                {formValues.avatarUrl ? (
                  <img src={formValues.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <svg viewBox="0 0 120 100" className="w-32 text-blue-500" fill="currentColor">
                      <path d="M20 80 Q30 40 60 35 Q90 30 100 80 Z" opacity="0.8" />
                      <path d="M35 80 Q45 55 60 50 Q75 45 85 80 Z" opacity="0.5" />
                    </svg>
                  </div>
                )}
                <button type="button" className="absolute bottom-2 right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors">
                  <UploadCloud size={15} className="text-white" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 max-w-55">
                Supported Files: <strong>.png</strong>, <strong>.jpg</strong>, <strong>.jpeg</strong>.
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full border rounded px-3 py-2 text-sm outline-none transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-200 focus:border-indigo-400"
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full border rounded px-3 py-2 text-sm outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-200 focus:border-indigo-400"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}