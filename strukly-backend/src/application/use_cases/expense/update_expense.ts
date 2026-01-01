import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";
import { UpdateExpenseRequest } from "src/infrastructure/schemas";
import ExpenseID from "src/domain/values/expense_id";
import ExpenseCategory from "src/domain/values/expense_category";
import Money from "src/domain/values/money";
import ExpenseItem from "src/domain/entities/expense_item";

export default class UpdateExpenseUseCase {
  constructor(private readonly expenseService: ExpenseService) {}
  async execute(
    userID: string,
    expenseID: string,
    updateValues: UpdateExpenseRequest,
  ) {
    const expense = await this.expenseService.getExpenseByID(
      new UserID(userID),
      new ExpenseID(expenseID),
    );

    if (!expense) {
      throw new Error("Expense not found");
    }

    expense.updateHeader({
      dateTime: new Date(updateValues.dateTime),
      vendorName: updateValues.vendorName,
      category: ExpenseCategory.fromString(updateValues.category),
      subtotalAmount: new Money(
        updateValues.subtotalAmount.amount,
        updateValues.subtotalAmount.currency,
      ),
      taxAmount: new Money(
        updateValues.taxAmount.amount,
        updateValues.taxAmount.currency,
      ),
      discountAmount: new Money(
        updateValues.discountAmount.amount,
        updateValues.discountAmount.currency,
      ),
      serviceAmount: new Money(
        updateValues.serviceAmount.amount,
        updateValues.serviceAmount.currency,
      ),
    });

    expense.updateItems(
      updateValues.items.map((item) =>
        ExpenseItem.new({
          name: item.name,
          quantity: item.quantity,
          singlePrice: new Money(
            item.singlePrice.amount,
            item.singlePrice.currency,
          ),
          expenseID: expense.getExpenseID(),
        }),
      ),
    );

    return this.expenseService.updateExpense(new UserID(userID), expense);
  }
}
