import { CreateExpenseRequest } from "src/infrastructure/schemas";
import { mapCreateExpenseRequestToExpense } from "src/infrastructure/mappers";
import ExpenseService from "../../../domain/services/expense_service";

import BudgetService from "src/domain/services/budget_service";
import UserID from "src/domain/values/user_id";

export default class CreateExpenseUseCase {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly budgetService: BudgetService,
  ) {}
  async execute(
    userID: string,
    expense: CreateExpenseRequest,
  ) {
    const newExpense = mapCreateExpenseRequestToExpense(userID, expense);

    const createdExpense = await this.expenseService.createExpense(newExpense);

    await this.budgetService.useBudget(
      new UserID(userID),
      createdExpense.header.totalAmount.value,
    );

    return createdExpense;
  }
}
