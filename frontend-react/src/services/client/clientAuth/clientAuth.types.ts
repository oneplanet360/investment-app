import { z } from "zod";

export const clientSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

export type ClientSignInSchemaType = z.infer<typeof clientSignInSchema>;

export interface IClientUser {
  _id: string;
  name: string;
  email: string;
  role: "AGENT" | "INVESTOR";
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
