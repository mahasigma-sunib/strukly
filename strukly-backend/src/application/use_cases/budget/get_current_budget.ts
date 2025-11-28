import BudgetHistory from "src/domain/entities/budget_history";
import BudgetService from "src/domain/services/budget_service";

export default class GetCurrentBudgetUseCase {
  constructor(private readonly budgetService: BudgetService) {}

  async execute(userID: string): Promise<BudgetHistory> {
    return await this.budgetService.getCurrentUserBudget(userID);
  }
}
