import { z } from "zod";
import { MoneySchema } from "../common";
import { ExpenseItemResponseSchema } from "./expense-item.response";

export const ExpenseResponseSchema = z.object({
  id: z.string().uuid().describe("The unique identifier of the expense"),
  vendorName: z.string().describe("The name of the vendor/store"),
  category: z.string().describe("The expense category"),
  dateTime: z.string().datetime().describe("The date and time of the expense (ISO 8601)"),

  subtotalAmount: MoneySchema.describe("The subtotal before tax/service/discount"),
  taxAmount: MoneySchema.describe("The tax amount"),
  discountAmount: MoneySchema.describe("The discount amount"),
  serviceAmount: MoneySchema.describe("The service charge amount"),
  totalAmount: MoneySchema.describe("The total amount after all adjustments"),

  userID: z.string().uuid().describe("The ID of the user who owns this expense"),
  items: z.array(ExpenseItemResponseSchema).describe("The list of expense items"),
});

export type ExpenseResponse = z.infer<typeof ExpenseResponseSchema>;

// Wrapper for create/update responses
export const ExpenseCreatedResponseSchema = z.object({
  message: z.string().describe("Success message"),
  expense: ExpenseResponseSchema,
});

export type ExpenseCreatedResponse = z.infer<typeof ExpenseCreatedResponseSchema>;
