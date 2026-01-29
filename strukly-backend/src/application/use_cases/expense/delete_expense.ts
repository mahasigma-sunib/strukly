import ExpenseService from "src/domain/services/expense_service";
import ExpenseID from "src/domain/values/expense_id";
import UserID from "src/domain/values/user_id";

import BudgetService from "src/domain/services/budget_service";
import NotFoundError from "src/domain/errors/NotFoundError";
import InvalidDataError from "src/domain/errors/InvalidDataError";

export default class DeleteExpenseUseCase {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly budgetService: BudgetService,
  ) {}

  async execute(userID: string, expenseId: string): Promise<void> {
    const user = new UserID(userID);
    const expense = await this.expenseService.getExpenseByID(
        user, 
        new ExpenseID(expenseId)
    );

    if (!expense) {
        throw new NotFoundError("Expense not found");
    }

    // Check if expense is in the current budget period
    const currentBudget = await this.budgetService.getCurrentUserBudget(user);
    const expenseDate = expense.header.dateTime;
    const expenseMonth = expenseDate.getUTCMonth() + 1;
    const expenseYear = expenseDate.getUTCFullYear();

    if (
      expenseMonth !== currentBudget.month ||
      expenseYear !== currentBudget.year
    ) {
        throw new InvalidDataError("Cannot delete expense from a previous budget period");
    }

    const totalAmount = expense.header.totalAmount.value;

    await this.expenseService.deleteExpenseByID(
      user,
      new ExpenseID(expenseId)
    );

    // Refund the budget
    await this.budgetService.useBudget(user, -totalAmount);
  }
}
