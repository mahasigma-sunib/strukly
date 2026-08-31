import { z } from "zod";
import {
  MAX_ITEM_QUANTITY,
  MAX_MONEY_AMOUNT,
  MONEY_AMOUNT_TOO_LARGE,
} from "./money";

export const DISCOUNT_EXCEEDS_EXPENSE =
  "Discount cannot exceed the expense total";

const moneyAmountSchema = z
  .number()
  .finite()
  .min(0)
  .max(MAX_MONEY_AMOUNT, MONEY_AMOUNT_TOO_LARGE);

export const expenseSubmitSchema = z
  .object({
    vendorName: z
      .string()
      .trim()
      .min(1, "Vendor name is required")
      .max(255, "Vendor name is too long"),
    items: z.array(
      z.object({
        name: z.string().trim().min(1, "Item name is required"),
        singleItemPrice: moneyAmountSchema,
        quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY),
      })
    ),
    subtotalAmount: moneyAmountSchema,
    taxAmount: moneyAmountSchema,
    discountAmount: moneyAmountSchema,
    serviceAmount: moneyAmountSchema,
    totalAmount: moneyAmountSchema,
  })
  .refine(
    (expense) =>
      expense.subtotalAmount +
        expense.taxAmount +
        expense.serviceAmount -
        expense.discountAmount <=
      MAX_MONEY_AMOUNT,
    { message: MONEY_AMOUNT_TOO_LARGE, path: ["totalAmount"] }
  )
  .refine(
    (expense) =>
      expense.discountAmount <=
      expense.subtotalAmount + expense.taxAmount + expense.serviceAmount,
    { message: DISCOUNT_EXCEEDS_EXPENSE, path: ["discountAmount"] }
  );

export type ExpenseFormErrors = {
  vendorName?: string;
  items?: string;
  amount?: string;
};

export function getExpenseFormErrors(expense: {
  vendorName: string;
  items: { name: string; singleItemPrice?: number; quantity?: number }[];
  subtotalAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  serviceAmount?: number;
  totalAmount?: number;
}): ExpenseFormErrors {
  const result = expenseSubmitSchema.safeParse({
    vendorName: expense.vendorName,
    items: expense.items.map((item) => ({
      name: item.name,
      singleItemPrice: item.singleItemPrice ?? 0,
      quantity: item.quantity ?? 1,
    })),
    subtotalAmount: expense.subtotalAmount ?? 0,
    taxAmount: expense.taxAmount ?? 0,
    discountAmount: expense.discountAmount ?? 0,
    serviceAmount: expense.serviceAmount ?? 0,
    totalAmount: expense.totalAmount ?? 0,
  });

  if (result.success) return {};

  const errors: ExpenseFormErrors = {};
  for (const issue of result.error.issues) {
    const root = issue.path[0];
    if (root === "vendorName" && !errors.vendorName) {
      errors.vendorName = issue.message;
    } else if (root === "items" && issue.path[2] === "name" && !errors.items) {
      errors.items = issue.message;
    } else if (root === "discountAmount" && !errors.amount) {
      errors.amount = issue.message;
    } else if (
      !errors.amount &&
      (root === "totalAmount" ||
        root === "subtotalAmount" ||
        root === "taxAmount" ||
        root === "serviceAmount" ||
        (root === "items" && issue.path[2] !== "name"))
    ) {
      errors.amount = MONEY_AMOUNT_TOO_LARGE;
    }
  }
  return errors;
}
