import GoalItem from "src/domain/entities/goal_item";
import { GoalItemResponse } from "../schemas/responses";

export function mapGoalItemToResponse(goalItem: GoalItem): GoalItemResponse {
  return {
    id: goalItem.id.value,
    name: goalItem.name,
    price: goalItem.price,
    deposited: goalItem.deposited,
    completed: goalItem.completed,
    completedAt: goalItem.completedAt?.toISOString() || null,
    createdAt: goalItem.createdAt.toISOString(),
    updatedAt: goalItem.updatedAt.toISOString(),
  };
}
