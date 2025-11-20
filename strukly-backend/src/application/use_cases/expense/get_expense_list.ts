import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";

export default class GetExpenseListUseCase {
  constructor(private readonly expenseService: ExpenseService) {}
  async execute(userID: string) {
    return this.expenseService.getExpenseListByUserID(
      new UserID(userID)
    );
  }
}
