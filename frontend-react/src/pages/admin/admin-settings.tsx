import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Image, Palette, Layout, Loader2 } from "lucide-react";
import { useAdminSettingsQuery } from "../../services/admin/adminSettings/adminSettings.query";
import { useAdminSettingsMutation } from "../../services/admin/adminSettings/adminSettings.mutation";
import type { AdminSettingsPayload } from "../../services/admin/adminSettings/adminSettings.types";
import { getContrastColor } from "../../lib/utils";

const schema = z.object({
  appName: z.string().min(1, "App name is required"),
  frontendUrl: z.string().url("Invalid URL").or(z.literal("")),
  logoUrl: z.string().or(z.literal("")),
  faviconUrl: z.string().or(z.literal("")),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex")
    .or(z.literal("")),
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex")
    .or(z.literal("")),
  sidebarColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex")
    .or(z.literal("")),
  fontFamily: z.string().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <span className="text-indigo-500">{icon}</span>
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({
  label,
  desc,
  error,
  children,
}: {
  label: string;
  desc?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-0.5">
      {label}
    </label>
    {desc && <p className="text-xs text-gray-400 mb-1.5">{desc}</p>}
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default function AdminSettings() {
  const { data: settingsData, isLoading } = useAdminSettingsQuery();
  const { mutate: updateSettings, isPending } = useAdminSettingsMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: settingsData
      ? {
          appName: settingsData.appName || "",
          frontendUrl: settingsData.frontendUrl || "",
          logoUrl: settingsData.logoUrl || "",
          faviconUrl: settingsData.faviconUrl || "",
          primaryColor: settingsData.primaryColor || "#4f46e5",
          backgroundColor: settingsData.backgroundColor || "#f0f2f8",
          sidebarColor: settingsData.sidebarColor || "#ffffff",
          fontFamily: settingsData.fontFamily || "Inter, sans-serif",
        }
      : undefined,
  });

  const app = useWatch({ control });

  const handleFileUpload = (
    k: keyof FormData,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setValue(k, base64Str, { shouldValidate: true, shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormData) => {
    updateSettings(data as AdminSettingsPayload);
  };

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700 mb-5">
        Admin Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 space-y-5"
        >
          {/* Brand Identity */}
          <Section icon={<Layout size={16} />} title="Brand Identity">
            <div className="space-y-4">
              <Field
                label="App Name"
                desc="The name displayed in the browser tab and sidebar if no logo is provided."
                error={errors.appName?.message}
              >
                <input
                  className={inputCls}
                  {...register("appName")}
                  placeholder="e.g. Finzip"
                />
              </Field>
              <Field
                label="Frontend URL"
                desc="The URL where the client-facing application is hosted."
                error={errors.frontendUrl?.message}
              >
                <input
                  className={inputCls}
                  type="url"
                  {...register("frontendUrl")}
                  placeholder="https://yourclienturl.com"
                />
              </Field>
            </div>
          </Section>

          {/* Graphics */}
          <Section icon={<Image size={16} />} title="Graphics & Images">
            <div className="space-y-4">
              <Field
                label="Upload Logo"
                desc="Upload an image for the logo (recommended: 150x50px, transparent PNG)."
              >
                <div className="flex gap-3 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={(e) => handleFileUpload("logoUrl", e)}
                  />
                  {app.logoUrl && (
                    <div className="shrink-0 h-10 w-24 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-1">
                      <img
                        src={app.logoUrl}
                        alt="Logo Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </Field>
              <Field
                label="Upload Favicon"
                desc="Upload a small icon for the browser tab (recommended: 32x32px)."
              >
                <div className="flex gap-3 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={(e) => handleFileUpload("faviconUrl", e)}
                  />
                  {app.faviconUrl && (
                    <div className="shrink-0 h-10 w-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-1">
                      <img
                        src={app.faviconUrl}
                        alt="Favicon Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </Field>
            </div>
          </Section>

          {/* Theme Colors */}
          <Section icon={<Palette size={16} />} title="Theme Colors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Primary Color"
                desc="Main color for buttons and active links."
                error={errors.primaryColor?.message}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={app.primaryColor || "#4f46e5"}
                    onChange={(e) =>
                      setValue("primaryColor", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    className={inputCls}
                    {...register("primaryColor")}
                    placeholder="#4f46e5"
                    maxLength={7}
                  />
                </div>
              </Field>
              <Field
                label="Background Color"
                desc="Global app background."
                error={errors.backgroundColor?.message}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={app.backgroundColor || "#f0f2f8"}
                    onChange={(e) =>
                      setValue("backgroundColor", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    className={inputCls}
                    {...register("backgroundColor")}
                    placeholder="#f0f2f8"
                    maxLength={7}
                  />
                </div>
              </Field>
              <Field
                label="Sidebar Color"
                desc="Sidebar background color."
                error={errors.sidebarColor?.message}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={app.sidebarColor || "#ffffff"}
                    onChange={(e) =>
                      setValue("sidebarColor", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    className={inputCls}
                    {...register("sidebarColor")}
                    placeholder="#ffffff"
                    maxLength={7}
                  />
                </div>
              </Field>
              <Field
                label="Font Family"
                desc="Global typography font."
                error={errors.fontFamily?.message}
              >
                <input
                  className={inputCls}
                  {...register("fontFamily")}
                  placeholder="Inter, sans-serif"
                />
              </Field>
            </div>
          </Section>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {isPending ? "Saving..." : "Save Appearance"}
          </button>
        </form>

        {/* Live Preview Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              Live Preview
            </h2>
            <div className="space-y-6">
              <div style={{ fontFamily: app.fontFamily || "inherit" }}>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Sidebar Branding
                </p>
                <div
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-200"
                  style={{
                    backgroundColor: app.sidebarColor || "#111827",
                    color: getContrastColor(app.sidebarColor || "#111827"),
                  }}
                >
                  {app.logoUrl ? (
                    <img
                      src={app.logoUrl}
                      alt="Logo"
                      className="h-6 object-contain"
                    />
                  ) : (
                    <span
                      className="font-bold text-lg tracking-tight"
                      style={{
                        color: getContrastColor(app.sidebarColor || "#111827"),
                      }}
                    >
                      {app.appName || "App Name"}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Browser Tab
                </p>
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-t-lg border-b border-gray-300 w-48">
                  {app.faviconUrl ? (
                    <img
                      src={app.faviconUrl}
                      alt="Favicon"
                      className="w-3.5 h-3.5"
                    />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-300" />
                  )}
                  <span className="text-xs text-gray-700 truncate">
                    {app.appName || "App Name"} - Admin
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Primary Button
                </p>
                <button
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg w-full transition-opacity hover:opacity-90"
                  style={{ backgroundColor: app.primaryColor || "#4f46e5" }}
                >
                  Action Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
