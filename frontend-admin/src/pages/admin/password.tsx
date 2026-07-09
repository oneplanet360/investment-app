import { Link } from "react-router-dom";
import { User, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminProfileQuery } from "../../services/adminProfile/adminProfile.query";
import { useUpdateAdminPasswordMutation } from "../../services/adminProfile/adminProfile.mutation";


const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function Password() {
  const { data: profile, isLoading } = useAdminProfileQuery();
  const { mutate: updatePassword, isPending } =
    useUpdateAdminPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormData) => {
    updatePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
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
        <h1 className="text-lg font-semibold text-gray-700">
          Password Setting
        </h1>
        <Link
          to="/profile"
          className="flex items-center gap-1.5 text-sm text-indigo-600 border border-indigo-400 rounded px-3 py-1.5 hover:bg-indigo-50 transition-colors"
        >
          <User size={13} />
          Profile Setting
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-65 shrink-0">
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="bg-indigo-600 px-5 py-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
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
              <span className="text-white font-semibold text-base">
                {profile?.name}
              </span>
            </div>
            <div className="bg-white divide-y divide-gray-100">
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-semibold text-indigo-700">
                  {profile?.name}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-indigo-500 font-medium">Email</span>
                <span className="text-gray-700 truncate w-32 text-right">
                  {profile?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 bg-white rounded-lg shadow-sm p-5 sm:p-6"
        >
          <h2 className="text-base font-semibold text-gray-700 mb-5">
            Change Password
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("currentPassword")}
                className={`w-full border rounded px-3 py-2 text-sm outline-none transition-colors ${
                  errors.currentPassword
                    ? "border-red-500"
                    : "border-gray-200 focus:border-indigo-400"
                }`}
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("newPassword")}
                className={`w-full border rounded px-3 py-2 text-sm outline-none transition-colors ${
                  errors.newPassword
                    ? "border-red-500"
                    : "border-gray-200 focus:border-indigo-400"
                }`}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className={`w-full border rounded px-3 py-2 text-sm outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-200 focus:border-indigo-400"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
