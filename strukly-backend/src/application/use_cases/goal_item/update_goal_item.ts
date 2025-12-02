// src/application/use_cases/goal_item/update_goal_item.ts

import { IGoalItemRepository } from "../../../domain/repositories/goal_item_repository";
import GoalItem, { IGoalItemEditor } from "../../../domain/entities/goal_item";
import GoalItemID from "../../../domain/values/goal_item_id";
import NotFoundError from "src/domain/errors/NotFoundError";
import InvalidDataError from "src/domain/errors/InvalidDataError";

export default class UpdateGoalItemUseCase {
  constructor(private readonly goalItemRepository: IGoalItemRepository) { }

  async execute(
    userId: string,
    goalItemID: string,
    data: Partial<IGoalItemEditor>,
  ): Promise<GoalItem> {
    if (!data.name && !data.price) {
      throw new InvalidDataError("Nothing to update");
    }

    const id = new GoalItemID(goalItemID);

    const existing = await this.goalItemRepository.findByID(id);
    if (!existing) throw new NotFoundError("Goal Item not found for this user");

    if (existing.userID.value !== userId)
      throw new NotFoundError("Goal Item not found for this user");

    existing.update(data);

    const updated = await this.goalItemRepository.update(existing);
    return updated;
  }
}
