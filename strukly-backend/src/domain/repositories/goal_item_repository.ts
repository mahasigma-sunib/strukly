// src/domain/repositories/goal_item_repository.ts

import GoalItem from "../entities/goal_item";
import GoalItemID from "../values/goal_item_id";
import UserID from "../values/user_id";

export interface IGoalItemRepository {
    create: (GoalItem: GoalItem) => Promise<GoalItem>;
    delete: (GoalItemID: GoalItemID) => Promise<void>;
    findByID: (GoalItemID: GoalItemID) => Promise<GoalItem | null>;
    findByUserID: (userID: UserID) => Promise<GoalItem[]>;
    update: (GoalItem: GoalItem) => Promise<GoalItem>;   
}