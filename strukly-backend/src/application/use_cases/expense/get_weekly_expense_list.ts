import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";

export default class GetWeeklyExpenseReportUseCase {
  constructor(private readonly expenseService: ExpenseService) {}

  async execute(userID: string, referenceDate: Date) {

    const startOfWeek = new Date(referenceDate);
    const currentDay = startOfWeek.getDay(); 
    

    const diffToSunday = startOfWeek.getDate() - currentDay;
    startOfWeek.setDate(diffToSunday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);


    const expenses = await this.expenseService.getExpensesByDateRange(
      new UserID(userID),
      startOfWeek,
      endOfWeek
    );


    const dailyTotals = [0, 0, 0, 0, 0, 0, 0];
    let totalSpent = 0;

    for (const expense of expenses) {
      const amount = expense.header.totalAmount.value;
      const dayIndex = expense.header.dateTime.getDay();

      dailyTotals[dayIndex] += amount;
      totalSpent += amount;
    }

    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
      totalSpent: totalSpent,
      daily: dailyTotals,
      history: expenses
    };
  }
}