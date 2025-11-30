import Expense from "../aggregates/expense";
import ExpenseID from "../values/expense_id";
import UserID from "../values/user_id";

export default interface IExpenseRepository {
  create: (expense: Expense) => Promise<Expense>;
  delete: (expenseID: ExpenseID) => Promise<void>;
  findByID: (expenseID: ExpenseID) => Promise<Expense | null>;
  findByDateRange: (userID: UserID, yearfrom: Date, to: Date) => Promise<Expense[]>;
  update: (expense: Expense) => Promise<Expense>;
}
