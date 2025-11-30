import GoalItem from "src/domain/entities/goal_item";
import NotFoundError from "src/domain/errors/NotFoundError";
import { IGoalItemRepository } from "src/domain/repositories/goal_item_repository";
import GoalItemID from "src/domain/values/goal_item_id";
import UserID from "src/domain/values/user_id";

export default class MarkGoalItemCompletedUseCase {
  constructor(private readonly goalItemRepo: IGoalItemRepository) {}

  public async execute(userID: string, goalItemID: string): Promise<GoalItem> {
    const goalItem = await this.goalItemRepo.findByID(new GoalItemID(goalItemID));

    if (!goalItem) {
      throw new NotFoundError("Goal Item not found for this user");
    }

    if (goalItem.userID.equals(new UserID(userID)) === false) {
      throw new NotFoundError("Goal Item not found for this user");
    }

    goalItem.markCompleted();

    await this.goalItemRepo.update(goalItem);

    return goalItem;
  }
}