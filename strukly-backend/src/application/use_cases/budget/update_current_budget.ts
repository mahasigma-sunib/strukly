import IUnitOfWork from "src/domain/repositories/unit_of_work";
import BudgetService from "src/domain/services/budget_service";
import UserID from "src/domain/values/user_id";

export default class UpdateCurrentBudgetUseCase {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(userId: string, budget: number): Promise<void> {
    await this.unitOfWork.execute(async (tx) => {
      await this.budgetService.updateCurrentUserBudget(
        new UserID(userId),
        budget,
        tx,
      );
    });
  }
}
