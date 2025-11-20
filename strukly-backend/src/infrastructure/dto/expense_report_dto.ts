import { z } from "zod";

export const ExpenseReportRequestSchema = z.object({
  userId: z.uuid(),
  month: z.number().min(1).max(12),
  year: z.number().int().min(2000),
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

export type ExpenseReportRequest = z.infer<typeof ExpenseReportRequestSchema>;
export type HistoryItemDTO = z.infer<typeof HistoryItemDTOSchema>;
export type ExpenseReportResponse = z.infer<typeof ExpenseReportResponseSchema>;