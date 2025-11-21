import ExpenseService from "../../../domain/services/expense_service";
import IImageToExpenseService from "../../services/image_to_expense_service";

export default class CreateExpenseFromImageUseCase {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly imageToExpenseService: IImageToExpenseService
  ) { }
  async execute(base64Image: string) {
    const expense = await this.imageToExpenseService.imageToExpense(base64Image);
    return this.expenseService.createExpense(expense);
  }
}