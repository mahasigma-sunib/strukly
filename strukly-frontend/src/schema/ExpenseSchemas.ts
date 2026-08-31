import { z } from "zod";

export const expenseSubmitSchema = z.object({
  vendorName: z
    .string()
    .trim()
    .min(1, "Vendor name is required")
    .max(255, "Vendor name is too long"),
  items: z.array(
    z.object({
      name: z.string().trim().min(1, "Item name is required"),
    })
  ),
});

export type ExpenseFormErrors = {
  vendorName?: string;
  items?: string;
};

export function getExpenseFormErrors(
  expense: { vendorName: string; items: { name: string }[] }
): ExpenseFormErrors {
  const result = expenseSubmitSchema.safeParse({
    vendorName: expense.vendorName,
    items: expense.items,
  });

  if (result.success) return {};

  const errors: ExpenseFormErrors = {};
  for (const issue of result.error.issues) {
    if (issue.path[0] === "vendorName" && !errors.vendorName) {
      errors.vendorName = issue.message;
    }
    if (issue.path[0] === "items" && !errors.items) {
      errors.items = issue.message;
    }
  }
  return errors;
}
