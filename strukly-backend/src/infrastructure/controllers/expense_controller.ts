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
import { createExpenseReportResponseDTO } from "../dto/expense_report_dto";

export default class ExpenseController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly getExpenseListUseCase: GetExpenseListUseCase,
    private readonly getExpenseDetailUseCase: GetExpenseDetailUseCase,
    private readonly updateExpenseUseCase: UpdateExpenseUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase
  ) { }

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

  /*
  GET /api/expenses?month=1&year=2025
  Response:
  {
    "weekly": [
      0,
      0,
      0,
      0,
      0
    ],
    "history": []
  }
  */
  public getExpenseList = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const month = parseInt(req.query.month as string, 10);
      const year = parseInt(req.query.year as string, 10);

      console.log(month, year);

      const reportData = await this.getExpenseListUseCase.execute(userID, month, year);

      return res.status(200).json(createExpenseReportResponseDTO(reportData.weekly, reportData.history));
    } catch (error: unknown) {
      console.error(error);
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
