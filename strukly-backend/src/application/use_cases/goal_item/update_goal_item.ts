// src/application/use_cases/goal_item/update_goal_item.ts

import { IGoalItemRepository } from "../../../domain/repositories/goal_item_repository";
import GoalItem from "../../../domain/entities/goal_item";
import GoalItemID from "../../../domain/values/goal_item_id";

export default class UpdateGoalItemUseCase {
  constructor(private readonly goalItemRepository: IGoalItemRepository) {}

  async execute(
    userId: string,
    goalItemID: string,
    data: { name?: string; price?: number; progress?: number }
  ): Promise<GoalItem> {
    if (!goalItemID) throw new Error("goalItemID is required");
    if (data.name === undefined && data.price === undefined) {
      throw new Error("Nothing to update");
    }
    if (data.price !== undefined && data.price <= 0) {
      throw new Error("price must be positive");
    }
    if (data.progress !== undefined && data.progress < 0) {
      throw new Error("progress must be non-negative");
    }

    const id = new GoalItemID(goalItemID);
    const existing = await this.goalItemRepository.findByID(id);
    if (!existing) throw new Error("GoalItem not found");

    if (existing.userID.value !== userId) {
      throw new Error("Not allowed to update this GoalItem");
    }

    if (data.price !== undefined && data.price < existing.deposited) {
      throw new Error("New price cannot be lower than deposited amount");
    }

    if (data.name !== undefined) existing.name = data.name;
    if (data.price !== undefined) existing.price = data.price;
    if (data.progress !== undefined) existing.deposited = data.progress;
    existing.updatedAt = new Date();

    const updated = await this.goalItemRepository.update(existing);
    return updated;
  }
}