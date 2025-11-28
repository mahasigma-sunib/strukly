import InvalidDataError from "src/domain/errors/InvalidDataError";
import NotFoundError from "src/domain/errors/NotFoundError";
import UnauthorizedError from "src/domain/errors/UnauthorizedError";
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
    if (!goalItem) throw new NotFoundError("Goal item not found");

    if (!goalItem.userID.equals(new UserID(userID)))
      throw new UnauthorizedError("Unauthorized");

    const currentBudget = await this.budgetService.getCurrentUserBudget(userID);

    if (goalItem.remaining() < amount)
      throw new InvalidDataError("Amount exceeds goal price");

    if (currentBudget.unusedBudget < amount)
      throw new InvalidDataError("Insufficient budget");

    // TOOD: db transaction/uow
    goalItem.deposit(amount);
    await this.goalItemRepository.update(goalItem);
    await this.budgetService.useBudget(new UserID(userID), amount);
  }
}
