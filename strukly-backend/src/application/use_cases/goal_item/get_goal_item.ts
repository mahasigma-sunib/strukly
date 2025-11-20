// src/application/use_cases/goal_item/get_goal_item.ts

import { IGoalItemRepository } from "../../../domain/repositories/goal_item_repository";
import GoalItem from "../../../domain/entities/goal_item";
import GoalItemID from "../../../domain/values/goal_item_id";

export default class GetGoalItemUseCase {
  constructor(private readonly goalItemRepository: IGoalItemRepository) { }

  async execute(goalItemID: GoalItemID): Promise<GoalItem | null> {
    if (!goalItemID) {
      throw new Error("goalItemID is required");
    }

    return this.goalItemRepository.findByID(goalItemID);
  }
}