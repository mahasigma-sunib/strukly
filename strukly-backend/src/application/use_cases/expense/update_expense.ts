import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";
import { UpdateExpenseRequest } from "src/infrastructure/schemas";
import ExpenseID from "src/domain/values/expense_id";
import ExpenseCategory from "src/domain/values/expense_category";
import Money from "src/domain/values/money";
import ExpenseItem from "src/domain/entities/expense_item";

import BudgetService from "src/domain/services/budget_service";

export default class UpdateExpenseUseCase {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly budgetService: BudgetService,
  ) {}
  async execute(
    userID: string,
    expenseID: string,
    updateValues: UpdateExpenseRequest,
  ) {
    const user = new UserID(userID);
    const expense = await this.expenseService.getExpenseByID(
      user,
      new ExpenseID(expenseID),
    );

    if (!expense) {
      throw new Error("Expense not found");
    }

    // Check if expense is in the current budget period
    const currentBudget = await this.budgetService.getCurrentUserBudget(user);
    const expenseDate = expense.header.dateTime;
    
    // We compare month and year. 
    // Javascript getMonth() is 0-indexed, budget.month is 1-indexed (usually, based on getUTCMonth() + 1 in service)
    // Let's verify how month is stored. Prisma model says Int.
    // BudgetService: monthNow = now.getUTCMonth() + 1;
    // So we should compare expenseDate.getUTCMonth() + 1 and expenseDate.getUTCFullYear()
    
    const expenseMonth = expenseDate.getUTCMonth() + 1;
    const expenseYear = expenseDate.getUTCFullYear();

    if (
      expenseMonth !== currentBudget.month ||
      expenseYear !== currentBudget.year
    ) {
        throw new Error("Cannot update expense from a previous budget period");
    }

    const oldTotal = expense.header.totalAmount.value;

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

    const updatedExpense = await this.expenseService.updateExpense(new UserID(userID), expense);
    
    const newTotal = updatedExpense.header.totalAmount.value;
    const delta = newTotal - oldTotal;

    if (delta !== 0) {
        await this.budgetService.useBudget(user, delta);
    }

    return updatedExpense;
  }
}
