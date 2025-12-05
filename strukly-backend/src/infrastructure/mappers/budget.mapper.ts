import BudgetHistory from "src/domain/entities/budget_history";
import { BudgetHistoryResponse } from "../schemas/responses";

export function mapBudgetHistoryToResponse(history: BudgetHistory): BudgetHistoryResponse {
  return {
    month: history.month,
    year: history.year,
    budget: history.budget,
    unusedBudget: history.unusedBudget,
  };
}
