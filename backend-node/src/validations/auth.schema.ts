import { z } from 'zod';

export const adminSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required.'),
});

export type adminSignInSchemaType = z.infer<typeof adminSignInSchema>;

export const clientSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required.'),
});

export type clientSignInSchemaType = z.infer<typeof clientSignInSchema>;
