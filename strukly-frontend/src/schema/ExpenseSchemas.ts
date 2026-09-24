import { z } from "zod";
import {
  MAX_ITEM_QUANTITY,
  MAX_MONEY_AMOUNT,
  MONEY_AMOUNT_TOO_LARGE,
} from "./money";

export const DISCOUNT_EXCEEDS_EXPENSE = "validation.discountExceeds";

export const TIME_INVALID = "validation.timeInvalid";

export function parseTimeInput(
  raw: string
): { hours: number; minutes: number } | null {
  const input = raw.trim();
  if (!input) return null;

  let hours: number;
  let minutes: number;

  const separated = input.match(/^(\d{1,2})[:.](\d{1,2})$/);
  const compact = input.match(/^(\d{3,4})$/);
  const hourOnly = input.match(/^(\d{1,2})$/);

  if (separated) {
    hours = Number(separated[1]);
    minutes = Number(separated[2]);
  } else if (compact) {
    const padded = compact[1].padStart(4, "0");
    hours = Number(padded.slice(0, 2));
    minutes = Number(padded.slice(2));
  } else if (hourOnly) {
    hours = Number(hourOnly[1]);
    minutes = 0;
  } else {
    return null;
  }

  if (hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

export function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

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
      .min(1, "validation.vendorNameRequired")
      .max(255, "validation.vendorNameTooLong"),
    items: z.array(
      z.object({
        name: z.string().trim().min(1, "validation.itemNameRequired"),
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
  time?: string;
  items?: string;
  amount?: string;
};

export function getExpenseFormErrors(
  expense: {
    vendorName: string;
    items: { name: string; singleItemPrice?: number; quantity?: number }[];
    subtotalAmount?: number;
    taxAmount?: number;
    discountAmount?: number;
    serviceAmount?: number;
    totalAmount?: number;
  },
  timeText?: string
): ExpenseFormErrors {
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

  const errors: ExpenseFormErrors = {};
  if (timeText !== undefined && parseTimeInput(timeText) === null) {
    errors.time = TIME_INVALID;
  }

  if (result.success) return errors;

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
