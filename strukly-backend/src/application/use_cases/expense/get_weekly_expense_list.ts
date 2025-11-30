import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";

export default class GetWeeklyExpenseReportUseCase {
  constructor(private readonly expenseService: ExpenseService) { }

  async execute(userID: string, referenceDate: Date) {

    const startOfWeek = new Date(referenceDate);
    const currentDay = startOfWeek.getDay();


    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0); 

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

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

      const arrayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      dailyTotals[arrayIndex] += amount;
      totalSpent += amount;
    }

    const toLocalISO = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().split('T')[0];
    };

    return {
      startDate: toLocalISO(startOfWeek), 
      endDate: toLocalISO(endOfWeek),
      totalSpent: totalSpent,
      daily: dailyTotals,
      history: expenses
    };
  }
}