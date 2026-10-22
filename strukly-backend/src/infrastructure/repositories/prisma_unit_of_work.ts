import IUnitOfWork from "src/domain/repositories/unit_of_work";
import IBudgetHistoryRepository from "src/domain/repositories/budget_history_repository";
import IExpenseRepository from "src/domain/repositories/expense_repository";
import { IGoalItemRepository } from "src/domain/repositories/goal_item_repository";
import UserRepository from "src/domain/repositories/user_repository";
import { PrismaClient } from "src/generated/prisma/client";
import { PrismaClientLike } from "./prisma_types";
import PrismaBudgetHistoryRepository from "./prisma_budget_history_repository";
import PrismaExpenseRepository from "./prisma_expense_repository";
import PrismaGoalItemRepository from "./prisma_goal_item_repository";
import PrismaUserRepository from "./prisma_user_repository";

export default class PrismaUnitOfWork implements IUnitOfWork {
  readonly expenses: IExpenseRepository;
  readonly goalItems: IGoalItemRepository;
  readonly budgetHistories: IBudgetHistoryRepository;
  readonly users: UserRepository;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly client: PrismaClientLike = prisma,
  ) {
    this.expenses = new PrismaExpenseRepository(this.client);
    this.goalItems = new PrismaGoalItemRepository(this.client);
    this.budgetHistories = new PrismaBudgetHistoryRepository(this.client);
    this.users = new PrismaUserRepository(this.client);
  }

  async execute<T>(fn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    if (this.client !== this.prisma) {
      return fn(this);
    }

    return this.prisma.$transaction(async (tx) =>
      fn(new PrismaUnitOfWork(this.prisma, tx)),
    );
  }
}
