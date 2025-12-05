import { Router } from "express";

import BudgetController from "../controllers/budget_controller";
import { authMiddleware } from "../middleware/auth_middleware";
import { validateBody } from "../middleware/validation_middleware";
import { UpdateBudgetRequestSchema } from "../schemas";
import {
  getCurrentBudgetUseCase,
  updateCurrentBudgetUseCase,
} from "src/composition_root";

const budgetController = new BudgetController(
  getCurrentBudgetUseCase,
  updateCurrentBudgetUseCase,
);

export const budgetRouter = Router();

budgetRouter.get("/", authMiddleware, budgetController.getCurrentBudget);
budgetRouter.patch(
  "/",
  authMiddleware,
  validateBody(UpdateBudgetRequestSchema),
  budgetController.updateCurrentBudget,
);
