import BudgetHistory from "../entities/budget_history";
import UserID from "../values/user_id";

export default interface IBudgetHistoryRepository {
  create(budgetHistory: BudgetHistory): Promise<BudgetHistory>;
  findByUserDate(
    userID: UserID,
    month: number,
    year: number,
  ): Promise<BudgetHistory | null>;
  update(budgetHistory: BudgetHistory): Promise<void>;
}
