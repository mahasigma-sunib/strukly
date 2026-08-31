import { PrismaClient } from "@prisma/client";
import GoalItem from "../../domain/entities/goal_item";
import { IGoalItemRepository } from "../../domain/repositories/goal_item_repository";
import GoalItemID from "../../domain/values/goal_item_id";
import UserID from "../../domain/values/user_id";
import ExpenseCategory from "../../domain/values/expense_category";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import AlreadyExistError from "src/domain/errors/AlreadyExistError";

type GoalItemRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  deposited: number;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userID: string;
};

export default class PrismaGoalItemRepository implements IGoalItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(row: GoalItemRow): GoalItem {
    return new GoalItem(
      new GoalItemID(row.id),
      row.name,
      row.price,
      row.deposited ?? 0,
      row.completed,
      row.completedAt,
      row.createdAt,
      row.updatedAt,
      new UserID(row.userID),
      ExpenseCategory.fromString(row.category),
    );
  }

  async create(goalItem: GoalItem): Promise<GoalItem> {
    try {
      const created = await this.prisma.goalItem.create({
        data: {
          id: goalItem.id.value,
          userID: goalItem.userID.value,
          name: goalItem.name,
          category: goalItem.category.value,
          price: Math.floor(goalItem.price),
          deposited: Math.floor(goalItem.deposited ?? 0),
        },
      });

      return this.toDomain(created);
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

    return this.toDomain(found);
  }

  async findByUserID(userID: UserID): Promise<GoalItem[]> {
    const rows = await this.prisma.goalItem.findMany({
      where: { userID: userID.value },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async update(goalItem: GoalItem): Promise<GoalItem> {
    const updated = await this.prisma.goalItem.update({
      where: { id: goalItem.id.value },
      data: {
        name: goalItem.name,
        category: goalItem.category.value,
        price: Math.floor(goalItem.price),
        deposited: Math.floor(goalItem.deposited ?? 0),
        completed: goalItem.completed,
        completedAt: goalItem.completedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(goalItemID: GoalItemID): Promise<void> {
    await this.prisma.goalItem.delete({ where: { id: goalItemID.value } });
  }
}
