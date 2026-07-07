import { useState } from "react";

const countries = ["Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada","China","Costa Rica","Denmark","Egypt","France","Gambia","Germany","Ghana","India","Indonesia","Japan","Kenya","Malaysia","Mexico","Morocco","Netherlands","Nigeria","Norway","Pakistan","Philippines","Poland","Portugal","Russia","Saudi Arabia","South Africa","South Korea","Spain","Sweden","Switzerland","Tanzania","Thailand","Turkey","Uganda","United Kingdom","United States","Vietnam","Zambia","Zimbabwe"];

export default function AddAgent() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", mobile: "", username: "", password: "", country: "", sponsor: "", address: "", city: "", state: "", zip: "", status: "active" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-full bg-[#f0f2f8] p-4 sm:p-6">
      <h1 className="text-base font-semibold text-gray-700 mb-5">Add Agent</h1>
      <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["First Name","firstName"],["Last Name","lastName"],["Email","email"],["Mobile","mobile"],["Username","username"],["Password","password"],["Sponsor Username","sponsor"],["Address","address"],["City","city"],["State","state"],["Zip / Postal","zip"]].map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1">{label} {["firstName","lastName","email","username","password"].includes(key) && <span className="text-red-500">*</span>}</label>
              <input type={key === "password" ? "password" : "text"} value={form[key as keyof typeof form]} onChange={set(key as keyof typeof form)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Country <span className="text-red-500">*</span></label>
            <select value={form.country} onChange={set("country")} className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 bg-white">
              <option value="">Select country</option>
              {countries.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select value={form.status} onChange={set("status")} className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 bg-white">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded transition-colors">Add Agent</button>
      </div>
    </div>
  );
}