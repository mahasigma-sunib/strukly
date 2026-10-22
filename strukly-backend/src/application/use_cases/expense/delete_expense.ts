import ExpenseService from "src/domain/services/expense_service";
import ExpenseID from "src/domain/values/expense_id";
import UserID from "src/domain/values/user_id";

import BudgetService from "src/domain/services/budget_service";
import NotFoundError from "src/domain/errors/NotFoundError";
import InvalidDataError from "src/domain/errors/InvalidDataError";
import IUnitOfWork from "src/domain/repositories/unit_of_work";

export default class DeleteExpenseUseCase {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly budgetService: BudgetService,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(userID: string, expenseId: string): Promise<void> {
    const user = new UserID(userID);

    await this.unitOfWork.execute(async (tx) => {
      const expense = await this.expenseService.getExpenseByID(
        user,
        new ExpenseID(expenseId),
        tx,
      );

      if (!expense) {
        throw new NotFoundError("Expense not found");
      }

      // Check if expense is in the current budget period
      const currentBudget = await this.budgetService.getCurrentUserBudget(
        user,
        tx,
      );
      const expenseDate = expense.header.dateTime;
      const expenseMonth = expenseDate.getUTCMonth() + 1;
      const expenseYear = expenseDate.getUTCFullYear();

      if (
        expenseMonth !== currentBudget.month ||
        expenseYear !== currentBudget.year
      ) {
        throw new InvalidDataError(
          "Cannot delete expense from a previous budget period",
        );
      }

      const totalAmount = expense.header.totalAmount.value;

      await this.expenseService.deleteExpenseByID(
        user,
        new ExpenseID(expenseId),
        tx,
      );

      // Refund the budget
      await this.budgetService.useBudget(user, -totalAmount, tx);
    });
  }
}
