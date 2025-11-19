import { PrismaClient } from "@prisma/client";
import IGoalItemRepository from "src/domain/repositories/goal_item_repository";
import GoalItem from "src/domain/entities/goal_item";

export default class PrismaGoalItemRepository implements IGoalItemRepository {
    private prisma = new PrismaClient();
    constructor() { }

    public async create(goalItem: GoalItem): Promise<void> {
        await this.prisma.goalItem.create({
            data: {
                id: goalItem.id.value,
                userID: goalItem.userID.value,
                name: goalItem.name,
                price: goalItem.price,
                deposited: goalItem.deposited,
                completed: goalItem.completed,
                completedAt: goalItem.completedAt,
                createdAt: goalItem.createdAt,
                updatedAt: goalItem.updatedAt,
            }
        });
    }
}