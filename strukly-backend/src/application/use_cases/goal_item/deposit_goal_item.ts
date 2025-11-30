import InvalidDataError from "src/domain/errors/InvalidDataError";
import NotFoundError from "src/domain/errors/NotFoundError";
import { IGoalItemRepository } from "src/domain/repositories/goal_item_repository";
import BudgetService from "src/domain/services/budget_service";
import GoalItemID from "src/domain/values/goal_item_id";
import UserID from "src/domain/values/user_id";

export default class DepositGoalItemUseCase {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly goalItemRepository: IGoalItemRepository,
  ) {}
  async execute(userID: string, goalItemID: string, amount: number) {
    const goalItem = await this.goalItemRepository.findByID(
      new GoalItemID(goalItemID),
    );
    if (!goalItem) throw new NotFoundError("Goal item not found for this user");

    if (!goalItem.userID.equals(new UserID(userID)))
      throw new NotFoundError("Goal item not found for this user");

    const currentBudget = await this.budgetService.getCurrentUserBudget(
      new UserID(userID),
    );

    if (goalItem.remaining() < amount)
      throw new InvalidDataError("Amount exceeds goal price");

    if (currentBudget.unusedBudget < amount)
      throw new InvalidDataError("Insufficient budget");

    // TODO: db transaction/uow
    goalItem.deposit(amount);
    await this.goalItemRepository.update(goalItem);
    await this.budgetService.useBudget(new UserID(userID), amount);
  }
}
