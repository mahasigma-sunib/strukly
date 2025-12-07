import { Router } from "express";
import GoalItemController from "../controllers/goal_item_controllers";
import { authMiddleware } from "../middleware/auth_middleware";
import {
  validateBody,
  validateParams,
} from "../middleware/validation_middleware";

import {
  CreateGoalItemRequestSchema,
  UpdateGoalItemRequestSchema,
  DepositGoalItemRequestSchema,
  GoalItemIdParamSchema,
} from "../schemas";
import {
  createGoalItemUseCase as createUseCase,
  getGoalItemListUseCase as getListUseCase,
  getGoalItemUseCase as getUseCase,
  depositGoalItemUseCase as depositUseCase,
  markGoalItemCompletedUseCase as markCompletedUseCase,
  updateGoalItemUseCase as updateUseCase,
  deleteGoalItemUseCase as deleteUseCase,
} from "src/composition_root";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Goal management
 */

const controller = new GoalItemController(
  createUseCase,
  getListUseCase,
  getUseCase,
  depositUseCase,
  markCompletedUseCase,
  updateUseCase,
  deleteUseCase,
);

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the goal
 *               price:
 *                 type: integer
 *                 description: The target price for the goal
 *     responses:
 *       201:
 *         description: Goal created successfully
 */
router.post(
  "/goals",
  authMiddleware,
  validateBody(CreateGoalItemRequestSchema),
  controller.createGoalItem,
);

/**
 * @swagger
 * /goals:
 *   get:
 *     summary: Get list of goals
 *     tags: [Goals]
 *     responses:
 *       200:
 *         description: List of goals
 */
router.get("/goals", authMiddleware, controller.getGoalItemList);

/**
 * @swagger
 * /goals/{goalItemID}:
 *   get:
 *     summary: Get a specific goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: goalItemID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the goal
 *     responses:
 *       200:
 *         description: Goal details
 *       404:
 *         description: Goal not found
 */
router.get(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(GoalItemIdParamSchema),
  controller.getGoalItem,
);

/**
 * @swagger
 * /goals/complete/{goalItemID}:
 *   patch:
 *     summary: Mark a goal as completed
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: goalItemID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the goal
 *     responses:
 *       200:
 *         description: Goal marked as completed
 */
router.patch(
  "/goals/complete/:goalItemID",
  authMiddleware,
  validateParams(GoalItemIdParamSchema),
  controller.markGoalItemCompleted,
);

/**
 * @swagger
 * /goals/deposit/{goalItemID}:
 *   patch:
 *     summary: Deposit amount to a goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: goalItemID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the goal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: The amount to deposit
 *     responses:
 *       200:
 *         description: Deposit successful
 */
router.patch(
  "/goals/deposit/:goalItemID",
  authMiddleware,
  validateBody(DepositGoalItemRequestSchema),
  controller.depositGoalItem,
);

/**
 * @swagger
 * /goals/{goalItemID}:
 *   patch:
 *     summary: Update a goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: goalItemID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the goal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Goal updated successfully
 */
router.patch(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(GoalItemIdParamSchema),
  validateBody(UpdateGoalItemRequestSchema),
  controller.updateGoalItem,
);

/**
 * @swagger
 * /goals/{goalItemID}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: goalItemID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the goal
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 */
router.delete(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(GoalItemIdParamSchema),
  controller.deleteGoalItem,
);

export { router as goalItemRouter };
