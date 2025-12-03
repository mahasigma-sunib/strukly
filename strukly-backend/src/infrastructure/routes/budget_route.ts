import { Router } from "express";

import BudgetController from "../controllers/budget_controller";
import { authMiddleware } from "../middleware/auth_middleware";
import { validateBody } from "../middleware/validation_middleware";
import z from "zod";
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
  validateBody(z.object({ budget: z.number().int().positive() })),
  budgetController.updateCurrentBudget,
);
