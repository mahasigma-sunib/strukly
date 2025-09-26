import * as z from "zod";

export const emailSchema = z.email();
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one upperercase letter")
  .regex(/\d/, "Password must contain at least one numbcase letter")
  .regex(/[a-z]/, "Password must contain at least one lower");

