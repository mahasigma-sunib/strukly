import { z } from "zod";
import { MoneySchema } from "../common";
import { CreateExpenseItemRequestSchema } from "./expense-item.request";

// ============ Path Params ============

export const ExpenseIdParamSchema = z.object({
  expenseID: z.string().uuid("Invalid expense ID format"),
});

// ============ Query Params ============

export const ExpenseReportQuerySchema = z.object({
  month: z.coerce
    .number()
    .int()
    .min(1, "Month must be between 1-12")
    .max(12, "Month must be between 1-12")
    .describe("The month (1-12)"),
  year: z.coerce
    .number()
    .int()
    .min(2000, "Year must be 2000 or later")
    .describe("The year"),
});

// ============ Request Bodies ============

export const CreateExpenseRequestSchema = z.object({
  vendorName: z.string().describe("The name of the vendor/store"),
  category: z.string().describe("The expense category"),
  dateTime: z.iso
    .datetime()
    .describe("The date and time of the expense (ISO 8601)"),

  subtotalAmount: MoneySchema.describe(
    "The subtotal before tax/service/discount",
  ),
  taxAmount: MoneySchema.describe("The tax amount"),
  discountAmount: MoneySchema.describe("The discount amount"),
  serviceAmount: MoneySchema.describe("The service charge amount"),

  items: z
    .array(CreateExpenseItemRequestSchema)
    .describe("The list of expense items"),
});

export const UpdateExpenseRequestSchema = CreateExpenseRequestSchema;

// ============ Types ============

export type ExpenseIdParam = z.infer<typeof ExpenseIdParamSchema>;
export type ExpenseReportQuery = z.infer<typeof ExpenseReportQuerySchema>;
export type CreateExpenseRequest = z.infer<typeof CreateExpenseRequestSchema>;
export type UpdateExpenseRequest = z.infer<typeof UpdateExpenseRequestSchema>;
