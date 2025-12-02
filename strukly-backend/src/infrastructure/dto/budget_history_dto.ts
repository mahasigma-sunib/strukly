import BudgetHistory from "src/domain/entities/budget_history";
import z from "zod";

export const UpdateBudgetDTOSchema = z.object({
  budget: z.number().int().min(1),
});

export type UpdateBudgetDTO = z.infer<typeof UpdateBudgetDTOSchema>;

export type BudgetHistoryDTO = {
  month: number;
  year: number;
  budget: number;
  unusedBudget: number;
};

export function budgetHistoryToDTO(history: BudgetHistory): BudgetHistoryDTO {
  return {
    month: history.month,
    year: history.year,
    budget: history.budget,
    unusedBudget: history.unusedBudget,
  };
}
