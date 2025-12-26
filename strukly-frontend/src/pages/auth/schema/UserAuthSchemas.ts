import * as z from "zod";

export const emailSchema = z.email();
export const passwordSchema = z
  .string()
  .min(8, "must be at least 8 characters")
  .regex(/[A-Z]/, "must contain at least one uppercase letter")
  .regex(/\d/, "must contain at least one number")
  .regex(/[a-z]/, "must contain at least one lowercase letter");
