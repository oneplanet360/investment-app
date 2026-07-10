import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useCreateAgentMutation } from "../../../services/admin/adminAgents/adminAgents.mutation";
import type { AgentPayload } from "../../../services/admin/adminAgents/adminAgents.types";

const countries = ["Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada","China","Costa Rica","Denmark","Egypt","France","Gambia","Germany","Ghana","India","Indonesia","Japan","Kenya","Malaysia","Mexico","Morocco","Netherlands","Nigeria","Norway","Pakistan","Philippines","Poland","Portugal","Russia","Saudi Arabia","South Africa","South Korea","Spain","Sweden","Switzerland","Tanzania","Thailand","Turkey","Uganda","United Kingdom","United States","Vietnam","Zambia","Zimbabwe"];

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email"),
  mobile: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().min(1, "Country is required"),
  referredBy: z.string().optional(), // Sponsor Username
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddAgent() {
  const { mutate: createAgent, isPending } = useCreateAgentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isActive: true,
      country: "",
    },
  });

  const onSubmit = (data: FormData) => {
    createAgent(data as AgentPayload, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const inputCls = (error?: string) => `w-full border rounded px-3 py-2 text-sm outline-none transition-colors ${
    error ? "border-red-500" : "border-gray-200 focus:border-indigo-400 bg-white text-gray-700"
  }`;

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6">
      <h1 className="text-base font-semibold text-gray-700 mb-5">Add Agent</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">First Name</label>
            <input type="text" {...register("firstName")} className={inputCls(errors.firstName?.message)} />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Last Name</label>
            <input type="text" {...register("lastName")} className={inputCls(errors.lastName?.message)} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" {...register("email")} className={inputCls(errors.email?.message)} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Mobile</label>
            <input type="text" {...register("mobile")} className={inputCls(errors.mobile?.message)} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Username <span className="text-red-500">*</span></label>
            <input type="text" {...register("username")} className={inputCls(errors.username?.message)} />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Password <span className="text-red-500">*</span></label>
            <input type="password" {...register("password")} className={inputCls(errors.password?.message)} />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Sponsor Username</label>
            <input type="text" {...register("referredBy")} className={inputCls(errors.referredBy?.message)} placeholder="Optional" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Country <span className="text-red-500">*</span></label>
            <select {...register("country")} className={inputCls(errors.country?.message)}>
              <option value="">Select country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Address</label>
            <input type="text" {...register("address")} className={inputCls()} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">City</label>
            <input type="text" {...register("city")} className={inputCls()} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">State</label>
            <input type="text" {...register("state")} className={inputCls()} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Zip / Postal</label>
            <input type="text" {...register("zip")} className={inputCls()} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              {...register("isActive")}
              onChange={(e) => {
                const val = e.target.value === "true";
                reset(formValues => ({ ...formValues, isActive: val }));
              }}
              className={inputCls()}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

        </div>
        
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          Add Agent
        </button>
      </form>
    </div>
  );
}