import GoalItem, { IGoalItemBuilder } from "../entities/goal_item";
import IGoalItemRepository from "../repositories/goal_item_repository";

export default class GoalService {
    constructor(private readonly goalItemRepository: IGoalItemRepository) { }

    public createGoalItem(builder: IGoalItemBuilder) {
        const goalItem = GoalItem.new(builder);
        this.goalItemRepository.create(goalItem);
        return goalItem;
    }
}