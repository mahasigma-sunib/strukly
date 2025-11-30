import { Router } from "express";

import BudgetController from "../controllers/budget_controller";
import { authMiddleware } from "../middleware/auth_middleware";
import { validateBody } from "../middleware/validation_middleware";
import z from "zod";
import GetCurrentBudgetUseCase from "src/application/use_cases/budget/get_current_budget";
import BudgetService from "src/domain/services/budget_service";
import PrismaBudgetHistoryRepository from "../repositories/prisma_budget_history_repository";
import { PrismaClient } from "@prisma/client";
import PrismaUserRepository from "../repositories/prisma_user_repository";
import UpdateCurrentBudgetUseCase from "src/application/use_cases/budget/update_current_budget";

const prismaUserRepository = new PrismaUserRepository();
const prismaBudgetHistoryRepository = new PrismaBudgetHistoryRepository(
  new PrismaClient(),
);

const budgetService = new BudgetService(
  prismaUserRepository,
  prismaBudgetHistoryRepository,
);

const getCurrentBudgetUseCase = new GetCurrentBudgetUseCase(budgetService);
const updateCurrentBudgetUseCase = new UpdateCurrentBudgetUseCase(
  budgetService,
);

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
