import { CreateExpenseDTO } from "src/infrastructure/dto/expense_dto";
import Expense from "src/domain/aggregates/expense";
import ExpenseService from "../../../domain/services/expense_service";
import ExpenseMapper from "src/application/services/expense_mapper";

export default class CreateExpenseUseCase {
  constructor(private readonly expenseService: ExpenseService) {}
  async execute(
    userID: string,
    expense: CreateExpenseDTO,
  ) {
    const newExpense: Expense = ExpenseMapper.fromCreateDTO(
      userID,
      expense
    );

    return this.expenseService.createExpense(newExpense);
  }
}
