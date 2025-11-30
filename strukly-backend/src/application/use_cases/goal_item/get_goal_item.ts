// src/application/use_cases/goal_item/get_goal_item.ts

import { IGoalItemRepository } from "src/domain/repositories/goal_item_repository";
import GoalItem from "src/domain/entities/goal_item";
import GoalItemID from "src/domain/values/goal_item_id";
import UserID from "src/domain/values/user_id";
import NotFoundError from "src/domain/errors/NotFoundError";

export default class GetGoalItemUseCase {
  constructor(private readonly goalItemRepository: IGoalItemRepository) {}

  async execute(userID: string, goalItemID: string): Promise<GoalItem> {
    const goalItem = await this.goalItemRepository.findByID(new GoalItemID(goalItemID));
    
    if (!goalItem) {
      throw new NotFoundError("Goal item not found for this user");
    }
    if (!goalItem.userID.equals(new UserID(userID))) {
      throw new NotFoundError("Goal item not found for this user");
    }

    return goalItem;
  }
}
