import { z } from "zod";

export const MoneySchema = z.object({
  amount: z.number().describe("The monetary amount"),
  currency: z
    .string()
    .min(1, "Currency is required")
    .max(3, "Currency code should be 3 characters or less")
    .describe("The currency code (e.g., USD, EUR)"),
});

export type Money = z.infer<typeof MoneySchema>;
