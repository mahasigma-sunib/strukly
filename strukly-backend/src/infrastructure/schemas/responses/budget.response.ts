import { z } from "zod";

export const BudgetHistoryResponseSchema = z.object({
  month: z.number().int().min(1).max(12).describe("The month (1-12)"),
  year: z.number().int().describe("The year"),
  budget: z.number().int().describe("The budget amount for this period"),
  unusedBudget: z.number().int().describe("The remaining unused budget"),
});

export type BudgetHistoryResponse = z.infer<typeof BudgetHistoryResponseSchema>;
