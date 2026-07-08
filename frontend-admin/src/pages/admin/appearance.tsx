import { useState } from "react";
import { appearanceSettings } from "../../lib/data";
import { toast } from "sonner";
import { Save, Image, Palette, Layout } from "lucide-react";

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <span className="text-indigo-500">{icon}</span>
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-0.5">{label}</label>
    {desc && <p className="text-xs text-gray-400 mb-1.5">{desc}</p>}
    {children}
  </div>
);

export default function AppearanceSettings() {
  const [app, setApp] = useState({ ...appearanceSettings });

  const setField = (k: keyof typeof app, v: string) => setApp((p) => ({ ...p, [k]: v }));

  const handleFileUpload = (k: keyof typeof app, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setField(k, base64Str);
    };
    reader.readAsDataURL(file);
  };
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call and possibly a context update for dynamic CSS
    toast.success("Appearance settings saved successfully.");
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors";

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6 space-y-5">
      <h1 className="text-base font-semibold text-gray-700">Appearance Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-5">
          {/* Brand Identity */}
          <Section icon={<Layout size={16} />} title="Brand Identity">
            <div className="space-y-4">
              <Field label="App Name" desc="The name displayed in the browser tab and sidebar if no logo is provided.">
                <input className={inputCls} value={app.appName} onChange={(e) => setField("appName", e.target.value)} placeholder="e.g. Finzip" />
              </Field>
            </div>
          </Section>

          {/* Graphics */}
          <Section icon={<Image size={16} />} title="Graphics & Images">
            <div className="space-y-4">
              <Field label="Upload Logo" desc="Upload an image for the logo (recommended: 150x50px, transparent PNG).">
                <div className="flex gap-3 items-center">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                    onChange={(e) => handleFileUpload("logoUrl", e)} 
                  />
                  {app.logoUrl && (
                    <div className="shrink-0 h-10 w-24 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-1">
                      <img src={app.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Upload Favicon" desc="Upload a small icon for the browser tab (recommended: 32x32px).">
                <div className="flex gap-3 items-center">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                    onChange={(e) => handleFileUpload("faviconUrl", e)} 
                  />
                  {app.faviconUrl && (
                    <div className="shrink-0 h-10 w-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-1">
                      <img src={app.faviconUrl} alt="Favicon Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                </div>
              </Field>
            </div>
          </Section>

          {/* Theme Colors */}
          <Section icon={<Palette size={16} />} title="Theme Colors">
            <Field label="Primary Color (Hex Code)" desc="The main color used for buttons, links, and active states.">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={app.primaryColor}
                  onChange={(e) => setField("primaryColor", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  className={inputCls}
                  value={app.primaryColor}
                  onChange={(e) => setField("primaryColor", e.target.value)}
                  placeholder="#4f46e5"
                  maxLength={7}
                />
              </div>
            </Field>
          </Section>

          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save size={15} /> Save Appearance
          </button>
        </form>

        {/* Live Preview Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Live Preview</h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Sidebar Branding</p>
                <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg">
                  {app.logoUrl ? (
                    <img src={app.logoUrl} alt="Logo" className="h-6 object-contain" />
                  ) : (
                    <span className="text-white font-bold text-lg tracking-tight">{app.appName}</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Browser Tab</p>
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-t-lg border-b border-gray-300 w-48">
                  {app.faviconUrl ? (
                    <img src={app.faviconUrl} alt="Favicon" className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-300" />
                  )}
                  <span className="text-xs text-gray-700 truncate">{app.appName} - Admin</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Primary Button</p>
                <button
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg w-full transition-opacity hover:opacity-90"
                  style={{ backgroundColor: app.primaryColor }}
                >
                  Action Button
                </button>
              </div>
            </div>
            
            <p className="text-[11px] text-gray-400 mt-6 bg-blue-50/50 p-2 rounded border border-blue-100">
              <strong>Note:</strong> Currently in static mode. In production, updating these values will dynamically repaint the application theme and branding instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
