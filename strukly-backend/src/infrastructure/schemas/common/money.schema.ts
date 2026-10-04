import { z } from "zod";

export const MAX_MONEY_AMOUNT = 99_999_999_999;

export const MONEY_AMOUNT_TOO_LARGE = `Amount cannot exceed ${MAX_MONEY_AMOUNT}`;

export const MoneySchema = z.object({
  amount: z.number().finite().describe("The monetary amount"),
  currency: z
    .string()
    .min(1, "Currency is required")
    .max(3, "Currency code should be 3 characters or less")
    .describe("The currency code (e.g., USD, EUR)"),
});

export const MoneyRequestSchema = z.object({
  amount: z
    .number()
    .finite("Amount must be a finite number")
    .min(0, "Amount must be non-negative")
    .max(MAX_MONEY_AMOUNT, MONEY_AMOUNT_TOO_LARGE)
    .describe("The monetary amount"),
  currency: z
    .string()
    .min(1, "Currency is required")
    .max(3, "Currency code should be 3 characters or less")
    .describe("The currency code (e.g., USD, EUR)"),
});

export type Money = z.infer<typeof MoneySchema>;
