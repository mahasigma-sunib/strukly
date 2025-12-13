import { Request, Response, NextFunction } from "express";
import GetCurrentBudgetUseCase from "src/application/use_cases/budget/get_current_budget";
import UpdateCurrentBudgetUseCase from "src/application/use_cases/budget/update_current_budget";
import { mapBudgetHistoryToResponse } from "../mappers";

export default class BudgetController {
  constructor(
    private readonly getCurrentBudgetUseCase: GetCurrentBudgetUseCase,
    private readonly updateCurrentBudgetUseCase: UpdateCurrentBudgetUseCase,
  ) {}

  getCurrentBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userID = req.user!.id;

      const budgetHistory = await this.getCurrentBudgetUseCase.execute(userID);

      res.status(200).json(mapBudgetHistoryToResponse(budgetHistory));
    } catch (error) {
      next(error);
    }
  };

  updateCurrentBudget = async (
    req: Request<{}, {}, { budget: number }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userID = req.user!.id;
      const budget = req.body.budget;

      await this.updateCurrentBudgetUseCase.execute(userID, budget);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
