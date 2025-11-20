import ExpenseMapper from "src/application/services/expense_mapper";
import ExpenseService from "src/domain/services/expense_service";
import UserID from "src/domain/values/user_id";
import { ExpenseDTO } from "src/infrastructure/dto/expense_dto";

export default class UpdateExpenseUseCase {
  constructor(private readonly expenseService: ExpenseService) {}
  async execute(userID: string, expense: ExpenseDTO) {
    const updatedExpense = ExpenseMapper.fromDTO(expense);

    return this.expenseService.updateExpense(
      new UserID(userID),
      updatedExpense
    );
  }
}
