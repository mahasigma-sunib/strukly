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

/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: Budget management
 */

/**
 * @swagger
 * /budget:
 *   get:
 *     summary: Get current budget
 *     tags: [Budget]
 *     responses:
 *       200:
 *         description: Current budget details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetHistoryResponse'
 */
budgetRouter.get("/", authMiddleware, budgetController.getCurrentBudget);

/**
 * @swagger
 * /budget:
 *   patch:
 *     summary: Update current budget
 *     tags: [Budget]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - budget
 *             properties:
 *               budget:
 *                 type: integer
 *                 description: The monthly budget amountc
 *     responses:
 *       200:
 *         description: Budget updated successfully
 */
budgetRouter.patch(
  "/",
  authMiddleware,
  validateBody(UpdateBudgetRequestSchema),
  budgetController.updateCurrentBudget,
);
