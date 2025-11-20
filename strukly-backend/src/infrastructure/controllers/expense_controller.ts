import { Request, Response } from "express";
import {
  CreateExpenseDTO,
  ExpenseDTO,
  expenseToDTO,
} from "../dto/expense_dto";
import CreateExpenseUseCase from "src/application/use_cases/expense/create_expense";
import GetExpenseListUseCase from "src/application/use_cases/expense/get_expense_list";
import GetExpenseDetailUseCase from "src/application/use_cases/expense/get_expense_detail";
import UpdateExpenseUseCase from "src/application/use_cases/expense/update_expense";
import DeleteExpenseUseCase from "src/application/use_cases/expense/delete_expense";

export default class ExpenseController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly getExpenseListUseCase: GetExpenseListUseCase,
    private readonly getExpenseDetailUseCase: GetExpenseDetailUseCase,
    private readonly updateExpenseUseCase: UpdateExpenseUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase
  ) {}

  public createExpense = async (
    req: Request<{}, {}, CreateExpenseDTO>,
    res: Response
  ): Promise<Response> => {
    try {
      const expenseData = req.body;
      const userID = req.user!.id;

      const result = await this.createExpenseUseCase.execute(
        userID,
        expenseData
      );

      return res.status(201).json({
        message: "Expense created successfully",
        expense: expenseToDTO(result),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public getExpenseList = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userID = req.user!.id;

      const expenses = await this.getExpenseListUseCase.execute(userID);

      const expenseDTOs = expenses.map(expenseToDTO);

      return res.status(200).json({ expenses: expenseDTOs });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public getExpenseDetail = async (
    req: Request<{ expenseID: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { expenseID } = req.params;

      const expense = await this.getExpenseDetailUseCase.execute(
        userID,
        expenseID
      );

      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      return res
        .status(200)
        .json({ expense: expenseToDTO(expense) });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public updateExpense = async (
    req: Request<{ expenseID: string }, {}, ExpenseDTO>,
    res: Response
  ): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { expenseID } = req.params;
      const expenseData = req.body;

      if (expenseID !== expenseData.id) {
        return res
          .status(400)
          .json({ error: "Expense ID in URL does not match ID in body" });
      }

      const updatedExpense = await this.updateExpenseUseCase.execute(
        userID,
        expenseData
      );

      return res.status(200).json({
        message: "Expense updated successfully",
        expense: expenseToDTO(updatedExpense),
      });
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public deleteExpense = async (
    req: Request<{ expenseID: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { expenseID } = req.params;

      await this.deleteExpenseUseCase.execute(userID, expenseID);

      return res
        .status(200)
        .json({ message: "Expense deleted successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
