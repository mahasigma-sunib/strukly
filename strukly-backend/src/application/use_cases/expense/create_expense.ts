import { CreateExpenseRequest } from "src/infrastructure/schemas";
import { mapCreateExpenseRequestToExpense } from "src/infrastructure/mappers";
import ExpenseService from "../../../domain/services/expense_service";

import BudgetService from "src/domain/services/budget_service";
import UserID from "src/domain/values/user_id";
import IUnitOfWork from "src/domain/repositories/unit_of_work";

export default class CreateExpenseUseCase {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly budgetService: BudgetService,
    private readonly unitOfWork: IUnitOfWork,
  ) {}
  async execute(
    userID: string,
    expense: CreateExpenseRequest,
    unitOfWork: IUnitOfWork = this.unitOfWork,
  ) {
    const newExpense = mapCreateExpenseRequestToExpense(userID, expense);

    return unitOfWork.execute(async (tx) => {
      const createdExpense = await this.expenseService.createExpense(
        newExpense,
        tx,
      );

      await this.budgetService.useBudget(
        new UserID(userID),
        createdExpense.header.totalAmount.value,
        tx,
      );

      return createdExpense;
    });
  }
}
