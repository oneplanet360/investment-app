import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, UploadCloud } from "lucide-react";

const user = {
  name: "Super Admins",
  username: "admin",
  email: "admin@site.com",
};

export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ name: user.name, email: user.email });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6">
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
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-white font-semibold text-base">{user.name}</span>
            </div>
            <div className="bg-white divide-y divide-gray-100">
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-semibold text-indigo-700">{user.name}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-500">Username</span>
                <span className="text-gray-700">{user.username}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-indigo-500 font-medium">Email</span>
                <span className="text-gray-700">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-sm p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-5">Profile Information</h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="shrink-0">
              <p className="text-sm text-gray-500 mb-2">Image</p>
              <div
                className="relative w-full sm:w-55 h-55 border border-gray-200 rounded-md overflow-hidden cursor-pointer group"
                onClick={() => fileRef.current?.click()}
              >
                {preview ? (
                  <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <svg viewBox="0 0 120 100" className="w-32 text-blue-500" fill="currentColor">
                      <path d="M20 80 Q30 40 60 35 Q90 30 100 80 Z" opacity="0.8" />
                      <path d="M35 80 Q45 55 60 50 Q75 45 85 80 Z" opacity="0.5" />
                    </svg>
                  </div>
                )}
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors">
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
                Supported Files: <strong>.png</strong>, <strong>.jpg</strong>, <strong>.jpeg</strong>. Image will be resized into <strong>400x400</strong>px
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}