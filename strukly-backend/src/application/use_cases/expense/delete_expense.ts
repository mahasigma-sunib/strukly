import ExpenseService from "src/domain/services/expense_service";
import ExpenseID from "src/domain/values/expense_id";
import UserID from "src/domain/values/user_id";

export default class DeleteExpenseUseCase {
  constructor(private readonly expenseService: ExpenseService) {}

  async execute(userId: string, expenseId: string): Promise<void> {
    await this.expenseService.deleteExpenseByID(
      new UserID(userId),
      new ExpenseID(expenseId)
    );
  }
}
