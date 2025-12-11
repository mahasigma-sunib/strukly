import { mapExpenseResponseToExpense } from "src/infrastructure/mappers";
import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";
import { ExpenseResponse } from "src/infrastructure/schemas";

export default class UpdateExpenseUseCase {
  constructor(private readonly expenseService: ExpenseService) {}
  async execute(userID: string, expense: ExpenseResponse) {
    const updatedExpense = mapExpenseResponseToExpense(expense);

    return this.expenseService.updateExpense(
      new UserID(userID),
      updatedExpense
    );
  }
}
