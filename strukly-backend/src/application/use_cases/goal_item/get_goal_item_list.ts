import GoalItem from "src/domain/entities/goal_item";
import { IGoalItemRepository } from "src/domain/repositories/goal_item_repository";
import UserID from "src/domain/values/user_id";

export default class GetGoalItemListUseCase {
  constructor(private readonly goalItemRepository: IGoalItemRepository) {}

  async execute(userID: string): Promise<GoalItem[]> {
    const goalItems = await this.goalItemRepository.findByUserID(
      new UserID(userID),
    );
    return goalItems;
  }
}
