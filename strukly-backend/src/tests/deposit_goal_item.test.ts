import DepositGoalItemUseCase from "../application/use_cases/goal_item/deposit_goal_item";
import CreateExpenseUseCase from "../application/use_cases/expense/create_expense";
import BudgetService from "../domain/services/budget_service";
import { IGoalItemRepository } from "../domain/repositories/goal_item_repository";
import GoalItem from "../domain/entities/goal_item";
import GoalItemID from "../domain/values/goal_item_id";
import UserID from "../domain/values/user_id";
import ExpenseCategory from "../domain/values/expense_category";
import BudgetHistory from "../domain/entities/budget_history";
import InvalidDataError from "../domain/errors/InvalidDataError";

describe("DepositGoalItemUseCase", () => {
  const userID = "user-123";
  const goalItemID = "goal-123";
  const otherUserID = "user-456";

  let useCase: DepositGoalItemUseCase;
  let mockBudgetService: jest.Mocked<Pick<BudgetService, "getCurrentUserBudget" | "useBudget">>;
  let mockGoalItemRepository: jest.Mocked<Pick<IGoalItemRepository, "findByID" | "update">>;
  let mockCreateExpenseUseCase: jest.Mocked<Pick<CreateExpenseUseCase, "execute">>;

  const createGoal = (overrides: Partial<{ deposited: number; userID: string }> = {}) =>
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

  beforeEach(() => {
    mockBudgetService = {
      getCurrentUserBudget: jest.fn(),
      useBudget: jest.fn(),
    };
    mockGoalItemRepository = {
      findByID: jest.fn(),
      update: jest.fn(),
    };
    mockCreateExpenseUseCase = {
      execute: jest.fn().mockResolvedValue({}),
    };

    useCase = new DepositGoalItemUseCase(
      mockBudgetService as unknown as BudgetService,
      mockGoalItemRepository as unknown as IGoalItemRepository,
      mockCreateExpenseUseCase as unknown as CreateExpenseUseCase,
    );
  });

  it("creates an expense for the deposit and does not deduct budget twice", async () => {
    const goal = createGoal();
    mockGoalItemRepository.findByID.mockResolvedValue(goal);
    mockGoalItemRepository.update.mockResolvedValue(goal);
    mockBudgetService.getCurrentUserBudget.mockResolvedValue({
      unusedBudget: 50000,
    } as BudgetHistory);

    await useCase.execute(userID, goalItemID, 2500);

    expect(mockCreateExpenseUseCase.execute).toHaveBeenCalledWith(
      userID,
      expect.objectContaining({
        vendorName: "New Laptop",
        category: "shopping",
        subtotalAmount: { amount: 2500, currency: "IDR" },
        items: [
          {
            name: "New Laptop",
            quantity: 1,
            singlePrice: { amount: 2500, currency: "IDR" },
          },
        ],
      }),
    );
    expect(mockBudgetService.useBudget).not.toHaveBeenCalled();
    expect(mockGoalItemRepository.update).toHaveBeenCalled();
    expect(goal.deposited).toBe(2500);
  });

  it("does not create an expense when the amount exceeds remaining goal price", async () => {
    mockGoalItemRepository.findByID.mockResolvedValue(createGoal({ deposited: 9000 }));
    mockBudgetService.getCurrentUserBudget.mockResolvedValue({
      unusedBudget: 50000,
    } as BudgetHistory);

    await expect(useCase.execute(userID, goalItemID, 2500)).rejects.toBeInstanceOf(
      InvalidDataError,
    );
    expect(mockCreateExpenseUseCase.execute).not.toHaveBeenCalled();
    expect(mockGoalItemRepository.update).not.toHaveBeenCalled();
  });

  it("does not create an expense when unused budget is insufficient", async () => {
    mockGoalItemRepository.findByID.mockResolvedValue(createGoal());
    mockBudgetService.getCurrentUserBudget.mockResolvedValue({
      unusedBudget: 100,
    } as BudgetHistory);

    await expect(useCase.execute(userID, goalItemID, 2500)).rejects.toBeInstanceOf(
      InvalidDataError,
    );
    expect(mockCreateExpenseUseCase.execute).not.toHaveBeenCalled();
    expect(mockGoalItemRepository.update).not.toHaveBeenCalled();
  });

  it("does not create an expense for another user's goal", async () => {
    mockGoalItemRepository.findByID.mockResolvedValue(
      createGoal({ userID: otherUserID }),
    );

    await expect(useCase.execute(userID, goalItemID, 2500)).rejects.toThrow(
      "Goal item not found for this user",
    );
    expect(mockCreateExpenseUseCase.execute).not.toHaveBeenCalled();
  });
});
