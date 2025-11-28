// src/application/use_cases/goal_item/delete_goal_item.ts

import NotFoundError from "src/domain/errors/NotFoundError";
import UnauthorizedError from "src/domain/errors/UnauthorizedError";
import { IGoalItemRepository } from "src/domain/repositories/goal_item_repository";
import GoalItemID from "src/domain/values/goal_item_id";

export default class DeleteGoalItemUseCase {
  constructor(private readonly goalItemRepository: IGoalItemRepository) {}

  async execute(goalItemId: string, userID: string): Promise<void> {
    const existing = await this.goalItemRepository.findByID(
      new GoalItemID(goalItemId),
    );
    if (!existing) {
      throw new NotFoundError("Goal Item not found");
    }

    if (existing.userID.value !== userID) {
      throw new UnauthorizedError(
        "You are not authorized to delete this Goal Item",
      );
    }

    await this.goalItemRepository.delete(new GoalItemID(goalItemId));
  }
}
