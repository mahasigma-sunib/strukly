import { z } from "zod";
import { MoneySchema } from "../common";

export const ExpenseItemResponseSchema = z.object({
  id: z.string().uuid().describe("The unique identifier of the expense item"),
  name: z.string().describe("The name of the expense item"),
  quantity: z.number().int().describe("The quantity purchased"),
  singlePrice: MoneySchema.describe("The price per unit"),
  totalPrice: MoneySchema.describe("The total price (quantity × singlePrice)"),
  expenseID: z.string().uuid().describe("The ID of the parent expense"),
});

export type ExpenseItemResponse = z.infer<typeof ExpenseItemResponseSchema>;
