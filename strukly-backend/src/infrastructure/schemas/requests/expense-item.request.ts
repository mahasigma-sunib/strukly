import { z } from "zod";
import { MAX_MONEY_AMOUNT, MONEY_AMOUNT_TOO_LARGE, MoneyRequestSchema } from "../common";

export const MAX_ITEM_QUANTITY = 9_999;

export const CreateExpenseItemRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Item name is required")
      .max(255, "Item name too long")
      .describe("The name of the expense item"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(MAX_ITEM_QUANTITY, "Quantity is too large")
      .describe("The quantity purchased"),
    singlePrice: MoneyRequestSchema.describe("The price per unit"),
  })
  .refine(
    (item) => item.quantity * item.singlePrice.amount <= MAX_MONEY_AMOUNT,
    { message: MONEY_AMOUNT_TOO_LARGE, path: ["singlePrice"] }
  );

export type CreateExpenseItemRequest = z.infer<typeof CreateExpenseItemRequestSchema>;
