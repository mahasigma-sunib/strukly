import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";

export default class GetMonthlyExpenseListUseCase {
constructor(private readonly expenseService: ExpenseService) {}
 async execute(
    userID: string,
    month: number,
    year: number
  ) {
    const expenses = await this.expenseService.getExpenseListByUserID(
      new UserID(userID),
      month,
      year
    );
    
    const weeklyTotals: number[] = [0, 0, 0, 0, 0];

    for (const expense of expenses) {
      const header = expense.header;
      const amount = header.totalAmount.value;

      const day = header.dateTime.getDate();
      const weekIndex = Math.floor((day - 1) / 7);
      if (weeklyTotals[weekIndex] !== undefined) {
        weeklyTotals[weekIndex] += amount;
      } else {
        weeklyTotals[4] += amount;
      }
    }

    return {
      weekly: weeklyTotals,
      history: expenses,
    };
  }
}
