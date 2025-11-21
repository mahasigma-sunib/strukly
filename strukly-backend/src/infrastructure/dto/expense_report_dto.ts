import Expense from "src/domain/aggregates/expense";
import { z } from "zod";

export const ExpenseReportRequestQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000)
});

export const HistoryItemDTOSchema = z.object({
  user_id: z.string(),
  subtotal: z.number(),
  tax: z.number(),
  service: z.number(),
  discount: z.number(),
  total_expense: z.number(),
  total_my_expense: z.number(),
  category: z.string(),
  datetime: z.date(),
  members: z.array(z.string()),
  vendor: z.string(),
});

export const ExpenseReportResponseSchema = z.object({
  weekly: z.array(z.number()),
  history: z.array(HistoryItemDTOSchema),
});

export type ExpenseReportRequestQuery = z.infer<typeof ExpenseReportRequestQuerySchema>;
export type HistoryItemDTO = z.infer<typeof HistoryItemDTOSchema>;
export type ExpenseReportResponse = z.infer<typeof ExpenseReportResponseSchema>;

export function createExpenseReportResponseDTO(
  weekly: number[],
  history: Expense[]
): ExpenseReportResponse {
  return {
    weekly,
    history: history.map((expense) => ({
      user_id: expense.header.userID.value,
      subtotal: expense.header.subtotalAmount.value,
      tax: expense.header.taxAmount.value,
      service: expense.header.serviceAmount.value,
      discount: expense.header.discountAmount.value,
      total_expense: expense.header.totalAmount.value,
      total_my_expense: expense.header.totalAmount.value,
      category: expense.header.category.value,
      datetime: expense.header.dateTime,
      members: [],
      vendor: expense.header.vendorName,
    })),
  };
}