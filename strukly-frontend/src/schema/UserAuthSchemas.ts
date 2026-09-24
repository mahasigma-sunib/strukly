import * as z from "zod";

export const emailSchema = z.email("validation.emailInvalid");
export const passwordSchema = z
  .string()
  .min(8, "validation.passwordMin")
  .regex(/\d/, "validation.passwordNumber")
  .refine((value) => /[a-z]/.test(value) && /[A-Z]/.test(value), {
    message: "validation.passwordCase",
  });

