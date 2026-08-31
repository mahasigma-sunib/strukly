import { z } from "zod";
import { EXPENSE_CATEGORIES } from "src/domain/values/expense_category";
import { MAX_MONEY_AMOUNT, MONEY_AMOUNT_TOO_LARGE, MoneyRequestSchema } from "../common";
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

export const CreateExpenseRequestSchema = z
  .object({
    vendorName: z
      .string()
      .trim()
      .min(1, "Vendor name is required")
      .max(255, "Vendor name too long")
      .describe("The name of the vendor/store"),
    category: z.enum(EXPENSE_CATEGORIES).describe("The expense category"),
    dateTime: z.iso
      .datetime()
      .describe("The date and time of the expense (ISO 8601)"),

    subtotalAmount: MoneyRequestSchema.describe(
      "The subtotal before tax/service/discount",
    ),
    taxAmount: MoneyRequestSchema.describe("The tax amount"),
    discountAmount: MoneyRequestSchema.describe("The discount amount"),
    serviceAmount: MoneyRequestSchema.describe("The service charge amount"),

    items: z
      .array(CreateExpenseItemRequestSchema)
      .describe("The list of expense items"),
  })
  .refine(
    (expense) =>
      expense.subtotalAmount.amount +
        expense.taxAmount.amount +
        expense.serviceAmount.amount -
        expense.discountAmount.amount <=
      MAX_MONEY_AMOUNT,
    { message: MONEY_AMOUNT_TOO_LARGE, path: ["subtotalAmount"] },
  );

export const UpdateExpenseRequestSchema = CreateExpenseRequestSchema;

// ============ Types ============

export type ExpenseIdParam = z.infer<typeof ExpenseIdParamSchema>;
export type ExpenseReportQuery = z.infer<typeof ExpenseReportQuerySchema>;
export type CreateExpenseRequest = z.infer<typeof CreateExpenseRequestSchema>;
export type UpdateExpenseRequest = z.infer<typeof UpdateExpenseRequestSchema>;
