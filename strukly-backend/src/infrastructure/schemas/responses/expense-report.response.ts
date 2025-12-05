import { z } from "zod";

export const HistoryItemResponseSchema = z.object({
  user_id: z.string().uuid().describe("The ID of the user"),
  id: z.string().uuid().describe("The expense ID"),
  subtotal: z.number().describe("The subtotal amount"),
  tax: z.number().describe("The tax amount"),
  service: z.number().describe("The service charge amount"),
  discount: z.number().describe("The discount amount"),
  total_expense: z.number().describe("The total expense amount"),
  total_my_expense: z.number().describe("The user's portion of the expense"),
  category: z.string().describe("The expense category"),
  datetime: z.date().describe("The date and time of the expense"),
  members: z.array(z.string()).describe("List of members sharing this expense"),
  vendor: z.string().describe("The vendor name"),
});

export const WeeklyDataSchema = z.object({
  week: z.number().int().describe("The week number"),
  spending: z.number().describe("Total spending for the week"),
  startDate: z.number().describe("Start date of the week (day of month)"),
  endDate: z.number().describe("End date of the week (day of month)"),
});

export const ExpenseReportResponseSchema = z.object({
  total: z.number().describe("Total spending for the period"),
  weekly: z.array(WeeklyDataSchema).describe("Weekly spending breakdown"),
  history: z.array(HistoryItemResponseSchema).describe("List of expense history items"),
});

export type HistoryItemResponse = z.infer<typeof HistoryItemResponseSchema>;
export type WeeklyData = z.infer<typeof WeeklyDataSchema>;
export type ExpenseReportResponse = z.infer<typeof ExpenseReportResponseSchema>;
