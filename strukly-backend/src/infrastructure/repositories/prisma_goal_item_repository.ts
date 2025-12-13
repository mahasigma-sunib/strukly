import { PrismaClient } from "@prisma/client";
import GoalItem from "../../domain/entities/goal_item";
import { IGoalItemRepository } from "../../domain/repositories/goal_item_repository";
import GoalItemID from "../../domain/values/goal_item_id";
import UserID from "../../domain/values/user_id";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import AlreadyExistError from "src/domain/errors/AlreadyExistError";

export default class PrismaGoalItemRepository implements IGoalItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(goalItem: GoalItem): Promise<GoalItem> {
    try {
      const created = await this.prisma.goalItem.create({
        data: {
          id: goalItem.id.value,
          userID: goalItem.userID.value,
          name: goalItem.name,
          price: Math.floor(goalItem.price),
          deposited: Math.floor(goalItem.deposited ?? 0),
        },
      });

      return new GoalItem(
        goalItem.id,
        goalItem.name,
        goalItem.price,
        goalItem.deposited,
        created.completed,
        created.completedAt,
        created.createdAt,
        created.updatedAt,
        new UserID(created.userID),
      );
    } catch (error) {
      console.error(error);

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AlreadyExistError("Goal Item already exists");
      }

      throw error;
    }
  }

  async findByID(goalItemID: GoalItemID): Promise<GoalItem | null> {
    const found = await this.prisma.goalItem.findUnique({
      where: { id: goalItemID.value },
    });

    if (!found) return null;


    return new GoalItem(
      new GoalItemID(found.id),
      found.name,
      found.price,
      found.deposited ?? 0,
      found.completed,
      found.completedAt,
      found.createdAt,
      found.updatedAt,
      new UserID(found.userID),
    );
  }

  async findByUserID(userID: UserID): Promise<GoalItem[]> {
    const rows = await this.prisma.goalItem.findMany({
      where: { userID: userID.value },
    });
    return rows.map((r) => {
      return new GoalItem(
        new GoalItemID(r.id),
        r.name,
        r.price,
        r.deposited ?? 0,
        r.completed,
        r.completedAt,
        r.createdAt,
        r.updatedAt,
        new UserID(r.userID),
      );
    });
  }

  async update(goalItem: GoalItem): Promise<GoalItem> {
    const updated = await this.prisma.goalItem.update({
      where: { id: goalItem.id.value },
      data: {
        name: goalItem.name,
        price: Math.floor(goalItem.price),
        deposited: Math.floor(goalItem.deposited ?? 0),
        completed: goalItem.completed,
        completedAt: goalItem.completedAt,
      },
    });


    return new GoalItem(
      new GoalItemID(updated.id),
      updated.name,
      updated.price,
      updated.deposited ?? 0,
      updated.completed,
      updated.completedAt,
      updated.createdAt,
      updated.updatedAt,
      new UserID(updated.userID),
    );
  }

  async delete(goalItemID: GoalItemID): Promise<void> {
    await this.prisma.goalItem.delete({ where: { id: goalItemID.value } });
  }
}
