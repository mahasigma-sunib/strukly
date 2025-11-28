import { Request, Response } from "express";
import GetCurrentBudgetUseCase from "src/application/use_cases/budget/get_current_budget";
import UpdateCurrentBudgetUseCase from "src/application/use_cases/budget/update_current_budget";
import AlreadyExistError from "src/domain/errors/AlreadyExistError";
import NotFoundError from "src/domain/errors/NotFoundError";
import UnauthorizedError from "src/domain/errors/UnauthorizedError";
import { budgetHistoryToDTO } from "../dto/budget_history_dto";

export default class BudgetController {
  constructor(
    private readonly getCurrentBudgetUseCase: GetCurrentBudgetUseCase,
    private readonly updateCurrentBudgetUseCase: UpdateCurrentBudgetUseCase,
  ) {}

  getCurrentBudget = async (req: Request, res: Response) => {
    try {
      const userID = req.user!.id;

      const budgetHistory = await this.getCurrentBudgetUseCase.execute(userID);

      res.status(200).json(budgetHistoryToDTO(budgetHistory));
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }

      // TODO: replace with middleware
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof AlreadyExistError) {
        return res.status(409).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  };

  updateCurrentBudget = async (
    req: Request<{}, {}, { budget: number }>,
    res: Response,
  ) => {
    try {
      const userID = req.user!.id;
      const budget = req.body.budget;

      await this.updateCurrentBudgetUseCase.execute(userID, budget);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }

      // TODO: replace with middleware
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof AlreadyExistError) {
        return res.status(409).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
