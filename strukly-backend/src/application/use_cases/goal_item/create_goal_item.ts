// src/application/use_cases/goal_item/create_goal_item.ts

import { IGoalItemRepository } from "../../../domain/repositories/goal_item_repository";
import GoalItem from "../../../domain/entities/goal_item";

export default class CreateGoalItemUseCase {
  constructor(private readonly goalItemRepository: IGoalItemRepository) {}

  async execute(userID: string, name: string, price: number): Promise<GoalItem> {
    const goal = GoalItem.new({ userID, name, price });

    const created = await this.goalItemRepository.create(goal);

    return created;
  }
}