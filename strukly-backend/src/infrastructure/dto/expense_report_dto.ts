import Expense from "src/domain/aggregates/expense";
import { z } from "zod";

export const ExpenseReportRequestQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000)
});

export const HistoryItemDTOSchema = z.object({
  user_id: z.string(),
  id: z.string(),
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

const WeeklyDataSchema = z.object({
  week: z.number(),
  spending: z.number(),
  startDate: z.number(),
  endDate: z.number(),
});

export const ExpenseReportResponseSchema = z.object({
  total: z.number(),
  weekly: z.array(WeeklyDataSchema),
  history: z.array(HistoryItemDTOSchema),
});

export type ExpenseReportRequestQuery = z.infer<typeof ExpenseReportRequestQuerySchema>;
export type HistoryItemDTO = z.infer<typeof HistoryItemDTOSchema>;
export type ExpenseReportResponse = z.infer<typeof ExpenseReportResponseSchema>;

export type WeeklyData = z.infer<typeof WeeklyDataSchema>;

export function toHistoryItemDTO(expense: Expense): HistoryItemDTO {
  return {
    user_id: expense.header.userID.value,
    id: expense.header.id.value,
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
  };
}

export function createExpenseReportResponseDTO(
  total: number,
  weekly: WeeklyData[],
  history: Expense[]
): ExpenseReportResponse {
  return {
    total,
    weekly,
    history: history.map(toHistoryItemDTO),
  };
}