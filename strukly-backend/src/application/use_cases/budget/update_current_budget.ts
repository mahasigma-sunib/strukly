import BudgetService from "src/domain/services/budget_service";

export default class UpdateCurrentBudgetUseCase {
  constructor(private readonly budgetService: BudgetService) {}

  async execute(userId: string, budget: number): Promise<void> {
    await this.budgetService.updateCurrentUserBudget(userId, budget);
  }
}
