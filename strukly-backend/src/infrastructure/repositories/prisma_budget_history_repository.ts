import { PrismaClient } from "@prisma/client";
import BudgetHistory from "src/domain/entities/budget_history";
import IBudgetHistoryRepository from "src/domain/repositories/budget_history_repository";
import UserID from "src/domain/values/user_id";

export default class PrismaBudgetHistoryRepository
  implements IBudgetHistoryRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  public async create(budgetHistory: BudgetHistory): Promise<BudgetHistory> {
    const newBudgetHistory = await this.prisma.budgetHistory.create({
      data: {
        userID: budgetHistory.userID.value,
        month: budgetHistory.month,
        year: budgetHistory.year,
        budget: budgetHistory.budget,
        unusedBudget: budgetHistory.unusedBudget,
      },
    });

    return new BudgetHistory(
      new UserID(newBudgetHistory.userID),
      newBudgetHistory.month,
      newBudgetHistory.year,
      newBudgetHistory.budget.toNumber(),
      newBudgetHistory.unusedBudget.toNumber(),
      newBudgetHistory.createdAt,
      newBudgetHistory.updatedAt,
    );
  }

  public async findByUserDate(
    userID: UserID,
    month: number,
    year: number,
  ): Promise<BudgetHistory | null> {
    const budgetHistory = await this.prisma.budgetHistory.findFirst({
      where: {
        userID: userID.value,
        month,
        year,
      },
    });

    if (!budgetHistory) return null;

    return new BudgetHistory(
      userID,
      budgetHistory.month,
      budgetHistory.year,
      budgetHistory.budget.toNumber(),
      budgetHistory.unusedBudget.toNumber(),
      budgetHistory.createdAt,
      budgetHistory.updatedAt,
    );
  }

  public async findLastBudgetHistory(
    userID: UserID,
  ): Promise<BudgetHistory | null> {
    const budgetHistory = await this.prisma.budgetHistory.findFirst({
      where: {
        userID: userID.value,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!budgetHistory) return null;

    return new BudgetHistory(
      userID,
      budgetHistory.month,
      budgetHistory.year,
      budgetHistory.budget.toNumber(),
      budgetHistory.unusedBudget.toNumber(),
      budgetHistory.createdAt,
      budgetHistory.updatedAt,
    );
  }

  public async update(budgetHistory: BudgetHistory): Promise<void> {
    await this.prisma.budgetHistory.update({
      where: {
        userID_month_year: {
          userID: budgetHistory.userID.value,
          month: budgetHistory.month,
          year: budgetHistory.year,
        },
      },
      data: {
        budget: budgetHistory.budget,
        unusedBudget: budgetHistory.unusedBudget,
      },
    });
  }
}
