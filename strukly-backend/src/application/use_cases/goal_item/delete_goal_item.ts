// src/application/use_cases/goal_item/delete_goal_item.ts

import NotFoundError from "src/domain/errors/NotFoundError";
import { IGoalItemRepository } from "src/domain/repositories/goal_item_repository";
import GoalItemID from "src/domain/values/goal_item_id";

export default class DeleteGoalItemUseCase {
  constructor(private readonly goalItemRepository: IGoalItemRepository) {}

  async execute(goalItemId: string, userID: string): Promise<void> {
    const existing = await this.goalItemRepository.findByID(
      new GoalItemID(goalItemId),
    );
    if (!existing) {
      throw new NotFoundError("Goal Item not found for this user");
    }

    if (existing.userID.value !== userID) {
      throw new NotFoundError("Goal Item not found for this user");
    }

    await this.goalItemRepository.delete(new GoalItemID(goalItemId));
  }
}
