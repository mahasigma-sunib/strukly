import { z } from "zod";
import { MAX_MONEY_AMOUNT, MONEY_AMOUNT_TOO_LARGE } from "../common";

export const UpdateBudgetRequestSchema = z.object({
  budget: z
    .number()
    .int()
    .min(1, "Budget must be at least 1")
    .max(MAX_MONEY_AMOUNT, MONEY_AMOUNT_TOO_LARGE)
    .describe("The monthly budget amount"),
});

export type UpdateBudgetRequest = z.infer<typeof UpdateBudgetRequestSchema>;
