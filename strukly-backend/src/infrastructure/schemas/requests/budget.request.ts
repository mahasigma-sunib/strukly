import { z } from "zod";

export const UpdateBudgetRequestSchema = z.object({
  budget: z
    .number()
    .int()
    .min(1, "Budget must be at least 1")
    .describe("The monthly budget amount"),
});

export type UpdateBudgetRequest = z.infer<typeof UpdateBudgetRequestSchema>;
