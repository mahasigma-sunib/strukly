import Expense from "../aggregates/expense";
import IExpenseRepository from "../repositories/expense_repository";
import ExpenseID from "../values/expense_id";
import UserID from "../values/user_id";

export default class ExpenseService {
  constructor(private readonly expenseRepository: IExpenseRepository) {}
  async createExpense(expense: Expense): Promise<Expense> {
    return await this.expenseRepository.create(expense);
  }

  /**
   * Update a expense, ensuring it belongs to the specified user.
   * @param userID
   * @param expense
   * @returns
   */
  async updateExpense(userID: UserID, expense: Expense): Promise<Expense> {
    // Ensure the expense belongs to the user before updating
    if (!expense.header.userID.equals(userID)) {
      throw new Error("Unauthorized: Expense does not belong to the user.");
    }

    return await this.expenseRepository.update(expense);
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
  ): Promise<Expense | null> {
    const expense = await this.expenseRepository.findByID(expenseID);
    if (expense && expense.header.userID.equals(userID)) {
      return expense;
    }
    return null;
  }

  async deleteExpenseByID(userID: UserID, expenseID: ExpenseID): Promise<void> {
    const expense = await this.expenseRepository.findByID(expenseID);
    if (!expense) {
      throw new Error("Expense not found.");
    }
    if (!expense.header.userID.equals(userID)) {
      throw new Error("Unauthorized: Expense does not belong to the user.");
    }
    await this.expenseRepository.delete(expenseID);
  }
}
