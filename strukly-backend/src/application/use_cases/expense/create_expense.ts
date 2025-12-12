import { CreateExpenseRequest } from "src/infrastructure/schemas";
import { mapCreateExpenseRequestToExpense } from "src/infrastructure/mappers";
import ExpenseService from "../../../domain/services/expense_service";

export default class CreateExpenseUseCase {
  constructor(private readonly expenseService: ExpenseService) {}
  async execute(
    userID: string,
    expense: CreateExpenseRequest,
  ) {
    const newExpense = mapCreateExpenseRequestToExpense(userID, expense);

    return this.expenseService.createExpense(newExpense);
  }
}
