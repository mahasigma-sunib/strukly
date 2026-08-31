import * as z from "zod";

export const emailSchema = z.email();
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/\d/, "Password must contain at least one number")
  .refine((value) => /[a-z]/.test(value) && /[A-Z]/.test(value), {
    message: "Password must contain a mix of uppercase and lowercase letters",
  });

