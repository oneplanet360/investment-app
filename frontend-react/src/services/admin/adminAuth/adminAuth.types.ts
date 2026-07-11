import { z } from "zod";

export const adminSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

export type AdminSignInSchemaType = z.infer<typeof adminSignInSchema>;

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  // Add other fields as necessary
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
