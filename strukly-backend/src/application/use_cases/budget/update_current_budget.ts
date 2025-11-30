import BudgetService from "src/domain/services/budget_service";
import UserID from "src/domain/values/user_id";

export default class UpdateCurrentBudgetUseCase {
  constructor(private readonly budgetService: BudgetService) {}

  async execute(userId: string, budget: number): Promise<void> {
    await this.budgetService.updateCurrentUserBudget(
      new UserID(userId),
      budget,
    );
  }
}
