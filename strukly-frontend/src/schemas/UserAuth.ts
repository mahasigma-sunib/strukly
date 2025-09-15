import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;