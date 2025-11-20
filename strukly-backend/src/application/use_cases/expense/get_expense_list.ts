import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";
import { ExpenseReportResponse } from "src/infrastructure/dto/expense_report_dto";

export default class GetExpenseListUseCase {
constructor(private readonly expenseService: ExpenseService) {}
 async execute(
    userID: string,
    month: number,
    year: number
  ): Promise<ExpenseReportResponse> {
    const expenses = await this.expenseService.getExpenseListByUserID(
      new UserID(userID),
      month,
      year
    );

    
    const weeklyTotals: number[] = [0, 0, 0, 0, 0];
    const history: any[] = []; 

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

      history.push({
        user_id: header.userID.value,
        subtotal: header.subtotalAmount.value,
        tax: header.taxAmount.value,
        service: header.serviceAmount.value,
        discount: header.discountAmount.value,
        total_expense: amount,
        total_my_expense: amount,
        category: header.category.toString(),
        datetime: header.dateTime,
        members: [], 
        vendor: header.vendorName,
      });
    }

    return {
      weekly: weeklyTotals,
      history: history,
    };
  }
}
