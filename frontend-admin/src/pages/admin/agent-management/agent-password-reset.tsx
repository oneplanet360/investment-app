import { useState } from "react";
import { Search } from "lucide-react";
import { users } from "../../../lib/data";


export default function AgentResetPassword() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof users)[0] | null>(null);
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const results = query.trim()
    ? users.filter(u => u.username.toLowerCase().includes(query.toLowerCase()) || `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6">
      <h1 className="text-base font-semibold text-gray-700 mb-5">Reset Agent Password</h1>
      <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6 space-y-5">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Search Agent</label>
          <div className="relative">
            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2 focus-within:border-indigo-400 transition-colors">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input type="text" value={query} onChange={e => { setQuery(e.target.value); setSelected(null); }}
                placeholder="Search by username or name..."
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent" />
            </div>
            {results.length > 0 && !selected && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b shadow-lg z-10 max-h-48 overflow-y-auto">
                {results.map(u => (
                  <button key={u.id} onClick={() => { setSelected(u); setQuery(`${u.firstName} ${u.lastName}`); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors border-b border-gray-50 last:border-0">
                    <p className="text-sm font-medium text-gray-800">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-indigo-500">@{u.username}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {selected && (
          <div className="bg-indigo-50 border border-indigo-200 rounded p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {selected.firstName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{selected.firstName} {selected.lastName}</p>
              <p className="text-xs text-indigo-500">@{selected.username} · {selected.email}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">New Password <span className="text-red-500">*</span></label>
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Confirm Password <span className="text-red-500">*</span></label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors" />
          </div>
        </div>
        {newPass && confirm && newPass !== confirm && (
          <p className="text-xs text-red-500">Passwords do not match.</p>
        )}
        <button disabled={!selected || !newPass || newPass !== confirm}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded transition-colors">
          Reset Password
        </button>
      </div>
    </div>
  );
}