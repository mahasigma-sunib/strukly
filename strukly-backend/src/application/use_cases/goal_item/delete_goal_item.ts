// src/application/use_cases/goal_item/delete_goal_item.ts

import { IGoalItemRepository } from "../../../domain/repositories/goal_item_repository";
import GoalItemID from "../../../domain/values/goal_item_id";

export default class DeleteGoalItemUseCase {
  constructor(private readonly goalItemRepository: IGoalItemRepository) {}

  async execute(goalItemId: string): Promise<void> {
    if (!goalItemId) throw new Error("goalItemId is required");

    const existing = await this.goalItemRepository.findByID(new GoalItemID(goalItemId));
    if (!existing) {
      throw new Error("GoalItem not found");
    }

    await this.goalItemRepository.delete(new GoalItemID(goalItemId));
  }
}