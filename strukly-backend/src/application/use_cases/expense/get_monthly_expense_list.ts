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
    
const firstDayOfMonthDate = new Date(year, month - 1, 1);
    
    const dayOfWeek = firstDayOfMonthDate.getDay();
    const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const weeklyTotals: number[] = [0, 0, 0, 0, 0, 0];
    let monthlyTotal = 0;

    for (const expense of expenses) {
      const header = expense.header;
      const amount = header.totalAmount.value;
      const dayOfMonth = header.dateTime.getDate(); 
      const weekIndex = Math.floor((dayOfMonth + startOffset - 1) / 7);

      if (weeklyTotals[weekIndex] !== undefined) {
        weeklyTotals[weekIndex] += amount;
      } else {
        // timezone edge case
        weeklyTotals[weeklyTotals.length - 1] += amount;
      }
      monthlyTotal += amount;
    }

    return {
      total: monthlyTotal,
      weekly: weeklyTotals,
      history: expenses,
    };
  }
}
