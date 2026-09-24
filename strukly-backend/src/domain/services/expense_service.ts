import Expense from "../aggregates/expense";
import IExpenseRepository from "../repositories/expense_repository";
import ExpenseID from "../values/expense_id";
import UserID from "../values/user_id";

export type ExpenseScope = {
  readonly expenses: IExpenseRepository;
};

export default class ExpenseService {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  private scopeOf(scope?: ExpenseScope): IExpenseRepository {
    return scope?.expenses ?? this.expenseRepository;
  }

  async createExpense(expense: Expense, scope?: ExpenseScope): Promise<Expense> {
    return await this.scopeOf(scope).create(expense);
  }

  /**
   * Update a expense, ensuring it belongs to the specified user.
   * @param userID
   * @param expense
   * @returns
   */
  async updateExpense(
    userID: UserID,
    expense: Expense,
    scope?: ExpenseScope,
  ): Promise<Expense> {
    // Ensure the expense belongs to the user before updating
    if (!expense.header.userID.equals(userID)) {
      throw new Error("Unauthorized: Expense does not belong to the user.");
    }

    return await this.scopeOf(scope).update(expense);
  }

  //crossmonth function for weekly reports
  async getExpensesByDateRange(userID: UserID, start: Date, end: Date) {
    return this.expenseRepository.findByDateRange(userID, start, end);
  }

  //actual per week report in the month separated per 7 days
  async getExpenseListByUserID(userID: UserID, month: number, year: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return this.expenseRepository.findByDateRange(userID, start, end);
  }

  /**
   * Get expense by ID, ensuring it belongs to the specified user.
   * @param userID
   * @param expenseID
   * @returns Expense
   */
  async getExpenseByID(
    userID: UserID,
    expenseID: ExpenseID,
    scope?: ExpenseScope,
  ): Promise<Expense | null> {
    const expense = await this.scopeOf(scope).findByID(expenseID);
    if (expense && expense.header.userID.equals(userID)) {
      return expense;
    }
    return null;
  }

  async deleteExpenseByID(
    userID: UserID,
    expenseID: ExpenseID,
    scope?: ExpenseScope,
  ): Promise<void> {
    const expenses = this.scopeOf(scope);
    const expense = await expenses.findByID(expenseID);
    if (!expense) {
      throw new Error("Expense not found.");
    }
    if (!expense.header.userID.equals(userID)) {
      throw new Error("Unauthorized: Expense does not belong to the user.");
    }
    await expenses.delete(expenseID);
  }
}
