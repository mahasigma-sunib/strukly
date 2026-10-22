import { describe, it, expect, beforeEach } from "vitest";
import DepositGoalItemUseCase from "../application/use_cases/goal_item/deposit_goal_item";
import CreateExpenseUseCase from "../application/use_cases/expense/create_expense";
import BudgetService from "../domain/services/budget_service";
import ExpenseService from "../domain/services/expense_service";
import InMemoryUnitOfWork, {
  InMemoryGoalItemRepository,
} from "./fakes/in_memory_unit_of_work";
import GoalItem from "../domain/entities/goal_item";
import GoalItemID from "../domain/values/goal_item_id";
import UserID from "../domain/values/user_id";
import ExpenseCategory from "../domain/values/expense_category";
import BudgetHistory from "../domain/entities/budget_history";
import User from "../domain/aggregates/user";
import InvalidDataError from "../domain/errors/InvalidDataError";

describe("DepositGoalItemUseCase", () => {
  const userID = "user-123";
  const goalItemID = "goal-123";
  const otherUserID = "user-456";

  const now = new Date();
  const currentMonth = now.getUTCMonth() + 1;
  const currentYear = now.getUTCFullYear();

  let uow: InMemoryUnitOfWork;
  let useCase: DepositGoalItemUseCase;

  const createGoal = (
    overrides: Partial<{ deposited: number; userID: string }> = {},
  ) =>
    new GoalItem(
      new GoalItemID(goalItemID),
      "New Laptop",
      10000,
      overrides.deposited ?? 0,
      false,
      null,
      new Date(),
      new Date(),
      new UserID(overrides.userID ?? userID),
      ExpenseCategory.fromString("shopping"),
    );

  const seedUser = async (id: string) => {
    await uow.users.create(
      new User({
        id,
        email: `${id}@example.com`,
        name: id,
        hashedPassword: "hash",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  };

  const seedBudget = async (id: string, amount: number) => {
    await uow.budgetHistories.create(
      new BudgetHistory(
        new UserID(id),
        currentMonth,
        currentYear,
        amount,
        amount,
        new Date(),
        new Date(),
      ),
    );
  };

  const userExpenses = () =>
    uow.expenses.findByDateRange(
      new UserID(userID),
      new Date(0),
      new Date("2100-01-01"),
    );

  const lastBudget = async (id: string) =>
    uow.budgetHistories.findLastBudgetHistory(new UserID(id));

  beforeEach(async () => {
    uow = new InMemoryUnitOfWork();
    const expenseService = new ExpenseService(uow.expenses);
    const budgetService = new BudgetService(uow.users, uow.budgetHistories);
    const createExpenseUseCase = new CreateExpenseUseCase(
      expenseService,
      budgetService,
      uow,
    );
    useCase = new DepositGoalItemUseCase(
      budgetService,
      uow.goalItems,
      createExpenseUseCase,
      uow,
    );

    await seedUser(userID);
  });

  it("creates an expense for the deposit and deducts the budget exactly once", async () => {
    await seedBudget(userID, 50000);
    await uow.goalItems.create(createGoal());

    await useCase.execute(userID, goalItemID, 2500);

    const expenses = await userExpenses();
    expect(expenses).toHaveLength(1);
    expect(expenses[0].header.vendorName).toBe("New Laptop");
    expect(expenses[0].header.category.value).toBe("shopping");
    expect(expenses[0].header.subtotalAmount.value).toBe(2500);
    expect(expenses[0].header.totalAmount.value).toBe(2500);
    expect(expenses[0].items).toHaveLength(1);
    expect(expenses[0].items[0].name).toBe("New Laptop");
    expect(expenses[0].items[0].quantity).toBe(1);
    expect(expenses[0].items[0].singlePrice.value).toBe(2500);

    expect((await lastBudget(userID))?.unusedBudget).toBe(47500);
    expect(
      (await uow.goalItems.findByID(new GoalItemID(goalItemID)))?.deposited,
    ).toBe(2500);
  });

  it("rolls back the expense and budget when persisting the goal update fails", async () => {
    await seedBudget(userID, 50000);
    await uow.goalItems.create(createGoal());
    const goalItems = uow.goalItems as InMemoryGoalItemRepository;
    goalItems.failNextUpdateError = new Error("write failed");

    await expect(useCase.execute(userID, goalItemID, 2500)).rejects.toThrow(
      "write failed",
    );

    expect(await userExpenses()).toHaveLength(0);
    expect((await lastBudget(userID))?.unusedBudget).toBe(50000);
    expect(
      (await uow.goalItems.findByID(new GoalItemID(goalItemID)))?.deposited,
    ).toBe(0);
  });

  it("does not create an expense when the amount exceeds remaining goal price", async () => {
    await seedBudget(userID, 50000);
    await uow.goalItems.create(createGoal({ deposited: 9000 }));

    await expect(useCase.execute(userID, goalItemID, 2500)).rejects.toBeInstanceOf(
      InvalidDataError,
    );

    expect(await userExpenses()).toHaveLength(0);
    expect((await lastBudget(userID))?.unusedBudget).toBe(50000);
    expect(
      (await uow.goalItems.findByID(new GoalItemID(goalItemID)))?.deposited,
    ).toBe(9000);
  });

  it("does not create an expense when unused budget is insufficient", async () => {
    await seedBudget(userID, 100);
    await uow.goalItems.create(createGoal());

    await expect(useCase.execute(userID, goalItemID, 2500)).rejects.toBeInstanceOf(
      InvalidDataError,
    );

    expect(await userExpenses()).toHaveLength(0);
    expect((await lastBudget(userID))?.unusedBudget).toBe(100);
    expect(
      (await uow.goalItems.findByID(new GoalItemID(goalItemID)))?.deposited,
    ).toBe(0);
  });

  it("does not create an expense for another user's goal", async () => {
    await seedBudget(userID, 50000);
    await uow.goalItems.create(createGoal({ userID: otherUserID }));

    await expect(useCase.execute(userID, goalItemID, 2500)).rejects.toThrow(
      "Goal item not found for this user",
    );

    expect(await userExpenses()).toHaveLength(0);
  });
});
