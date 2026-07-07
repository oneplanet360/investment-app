import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const user = {
  name: "Super Admins",
  username: "admin",
  email: "admin@site.com",
};

export default function Password() {
  const [form, setForm] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-700">Password Setting</h1>
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
          <h2 className="text-base font-semibold text-gray-700 mb-5">Change Password</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.newPassword}
                onChange={set("newPassword")}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
              />
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