import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInvestorsQuery } from "../../../services/adminInvestors/adminInvestors.query";
import { useResetInvestorPasswordMutation } from "../../../services/adminInvestors/adminInvestors.mutation";
import type { IInvestor } from "../../../services/adminInvestors/adminInvestors.types";

const schema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function InvestorResetPassword() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selected, setSelected] = useState<IInvestor | null>(null);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Use page 1, limit 5 for the dropdown search
  const { data, isLoading: isSearching } = useInvestorsQuery(1, 5, debouncedQuery);
  const results = data?.data || [];

  const { mutate: resetPassword, isPending } = useResetInvestorPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (formData: FormData) => {
    if (!selected) return;
    
    resetPassword(
      { investorId: selected._id, newPassword: formData.newPassword },
      {
        onSuccess: () => {
          reset();
          setSelected(null);
          setQuery("");
        }
      }
    );
  };

  const inputCls = (err?: string) => `w-full border rounded px-3 py-2 text-sm outline-none transition-colors ${
    err ? "border-red-500" : "border-gray-200 focus:border-indigo-400 text-gray-700"
  }`;

  return (
    <div className="min-h-full bg-(--theme-bg) p-4 sm:p-6">
      <h1 className="text-base font-semibold text-gray-700 mb-5">Reset Investor Password</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6 space-y-5">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Search Investor</label>
          <div className="relative">
            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2 focus-within:border-indigo-400 transition-colors">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                value={query} 
                onChange={e => { 
                  setQuery(e.target.value); 
                  setSelected(null); 
                }}
                placeholder="Search by username, name or email..."
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent" 
              />
              {isSearching && <Loader2 size={14} className="animate-spin text-gray-400" />}
            </div>
            
            {query.trim() && !selected && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b shadow-lg z-10 max-h-48 overflow-y-auto">
                {results.length > 0 ? (
                  results.map(u => (
                    <button 
                      key={u._id} 
                      onClick={() => { 
                        setSelected(u); 
                        setQuery(u.name); 
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <p className="text-sm font-medium text-gray-800">{u.name}</p>
                      <p className="text-xs text-indigo-500">@{u.username} • {u.email}</p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    {isSearching ? "Searching..." : "No investors found"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {selected && (
          <div className="bg-indigo-50 border border-indigo-200 rounded p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {selected.name ? selected.name.charAt(0).toUpperCase() : "I"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{selected.name}</p>
              <p className="text-xs text-indigo-500">@{selected.username} · {selected.email}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">New Password <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                {...register("newPassword")}
                disabled={!selected}
                className={inputCls(errors.newPassword?.message)} 
              />
              {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                {...register("confirmPassword")}
                disabled={!selected}
                className={inputCls(errors.confirmPassword?.message)} 
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button 
            type="submit"
            disabled={!selected || !isValid || !isDirty || isPending}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded transition-colors"
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}