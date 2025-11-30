import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";
import { WeeklyData } from "src/infrastructure/dto/expense_report_dto";

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
    const lastDayOfMonthDate = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonthDate.getDate();

    const dayOfWeek = firstDayOfMonthDate.getDay();
    const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const totalWeeks = Math.ceil((daysInMonth + startOffset) / 7);

    let monthlyTotal = 0;

    //setup start and end dates
    const weeklyData = Array.from({ length: totalWeeks }, (_, i) => {
      let endDay = (7 * (i + 1)) - startOffset;
      let startDay = endDay - 6;

      // ensure its in the month
      if (startDay < 1) startDay = 1;
      if (endDay > daysInMonth) endDay = daysInMonth;

      return {
        week: i + 1,
        spending: 0,
        startDate: startDay,
        endDate: endDay,
      };
    });

    for (const expense of expenses) {
      const header = expense.header;
      const amount = header.totalAmount.value;
      const dayOfMonth = header.dateTime.getDate(); 
      const weekIndex = Math.floor((dayOfMonth + startOffset - 1) / 7);

      if (weeklyData[weekIndex] !== undefined) {
        weeklyData[weekIndex].spending += amount;
      }
      monthlyTotal += amount;
    }

    return {
      total: monthlyTotal,
      weekly: weeklyData,
      history: expenses,
    };
  }
}
