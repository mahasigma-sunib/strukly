import ExpenseService from "src/domain/services/expense_service";
import ExpenseID from "src/domain/values/expense_id";
import UserID from "src/domain/values/user_id";

export default class GetExpenseDetailUseCase {
  constructor(private readonly expenseService: ExpenseService) {}
  async execute(userID: string, expenseID: string) {
    return this.expenseService.getExpenseByID(
      new UserID(userID),
      new ExpenseID(expenseID)
    );
  }
}
