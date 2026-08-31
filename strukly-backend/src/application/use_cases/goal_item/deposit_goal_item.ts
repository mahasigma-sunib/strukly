import CreateExpenseUseCase from "src/application/use_cases/expense/create_expense";
import InvalidDataError from "src/domain/errors/InvalidDataError";
import NotFoundError from "src/domain/errors/NotFoundError";
import { IGoalItemRepository } from "src/domain/repositories/goal_item_repository";
import BudgetService from "src/domain/services/budget_service";
import GoalItemID from "src/domain/values/goal_item_id";
import UserID from "src/domain/values/user_id";

export default class DepositGoalItemUseCase {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly goalItemRepository: IGoalItemRepository,
    private readonly createExpenseUseCase: CreateExpenseUseCase,
  ) {}
  async execute(userID: string, goalItemID: string, amount: number) {
    const goalItem = await this.goalItemRepository.findByID(
      new GoalItemID(goalItemID),
    );
    if (!goalItem) throw new NotFoundError("Goal item not found for this user");

    if (!goalItem.userID.equals(new UserID(userID)))
      throw new NotFoundError("Goal item not found for this user");

    const currentBudget = await this.budgetService.getCurrentUserBudget(
      new UserID(userID),
    );

    if (goalItem.remaining() < amount)
      throw new InvalidDataError("Amount exceeds goal price");

    if (currentBudget.unusedBudget < amount)
      throw new InvalidDataError("Insufficient budget");

    // TODO: db transaction/uow
    await this.createExpenseUseCase.execute(userID, {
      vendorName: goalItem.name,
      category: goalItem.category.value,
      dateTime: new Date().toISOString(),
      subtotalAmount: { amount, currency: "IDR" },
      taxAmount: { amount: 0, currency: "IDR" },
      discountAmount: { amount: 0, currency: "IDR" },
      serviceAmount: { amount: 0, currency: "IDR" },
      items: [
        {
          name: goalItem.name,
          quantity: 1,
          singlePrice: { amount, currency: "IDR" },
        },
      ],
    });

    goalItem.deposit(amount);
    await this.goalItemRepository.update(goalItem);
  }
}
