import GoalItem from "../entities/goal_item";

export default interface IGoalItemRepository {
    create(goalItem: GoalItem): Promise<void>;
}