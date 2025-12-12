import { z } from "zod";
import { MoneySchema } from "../common";

export const CreateExpenseItemRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Item name is required")
    .max(255, "Item name too long")
    .describe("The name of the expense item"),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .describe("The quantity purchased"),
  singlePrice: MoneySchema.describe("The price per unit"),
});

export type CreateExpenseItemRequest = z.infer<typeof CreateExpenseItemRequestSchema>;
