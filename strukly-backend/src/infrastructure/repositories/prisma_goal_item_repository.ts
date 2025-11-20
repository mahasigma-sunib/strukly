// src/infrastructure/repositories/prisma_goal_item_repository.ts

import { PrismaClient } from "@prisma/client";
import GoalItem from "../../domain/entities/goal_item";
import { IGoalItemRepository } from "../../domain/repositories/goal_item_repository";
import GoalItemID from "../../domain/values/goal_item_id";
import UserID from "../../domain/values/user_id";

export default class PrismaGoalItemRepository implements IGoalItemRepository {
  private prisma = new PrismaClient();

  constructor() {}

  async create(goalItem: GoalItem): Promise<GoalItem> {
    const created = await this.prisma.goalItem.create({
      data: {
        id: goalItem.id.value,
        userID: goalItem.userID.value,
        name: goalItem.name,
        price: Math.floor(goalItem.price),
        deposited: Math.floor(goalItem.deposited ?? 0),
      },
    });
    const completed = (created.deposited ?? 0) >= (created.price ?? 0);

    return GoalItem.fromPersistence({
      id: created.id,
      name: created.name,
      price: created.price,
      deposited: created.deposited ?? 0,
      completed: completed,
      completedAt: completed ? created.updatedAt : null,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      userID: created.userID,
    });
  }

  async findByID(goalItemID: GoalItemID): Promise<GoalItem | null> {
    const found = await this.prisma.goalItem.findUnique({
      where: { id: goalItemID.value },
    });

    if (!found) return null;

    const completed = (found.deposited ?? 0) >= (found.price ?? 0);

    return GoalItem.fromPersistence({
      id: found.id,
      name: found.name,
      price: found.price,
      deposited: found.deposited ?? 0,
      completed: completed,
      completedAt: completed ? found.updatedAt : null,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      userID: found.userID,
    });
  }

  async findByUserID(userID: UserID): Promise<GoalItem[]> {
    const rows = await this.prisma.goalItem.findMany({ where: { userID: userID.value } });
    return rows.map((r) => {
      const completed = (r.deposited ?? 0) >= (r.price ?? 0);
      return GoalItem.fromPersistence({
        id: r.id,
        name: r.name,
        price: r.price,
        deposited: r.deposited ?? 0,
        completed: completed,
        completedAt: completed ? r.updatedAt : null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        userID: r.userID,
      });
    });
  }

  async update(goalItem: GoalItem): Promise<GoalItem> {
    const updated = await this.prisma.goalItem.update({
      where: { id: goalItem.id.value },
      data: {
        name: goalItem.name,
        price: Math.floor(goalItem.price),
        deposited: Math.floor(goalItem.deposited ?? 0),
      },
    });

    const completed = (updated.deposited ?? 0) >= (updated.price ?? 0);

    return GoalItem.fromPersistence({
      id: updated.id,
      name: updated.name,
      price: updated.price,
      deposited: updated.deposited ?? 0,
      completed: completed,
      completedAt: completed ? updated.updatedAt : null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      userID: updated.userID,
    });
  }

  async delete(goalItemID: GoalItemID): Promise<void> {
    await this.prisma.goalItem.delete({ where: { id: goalItemID.value } });
  }
}