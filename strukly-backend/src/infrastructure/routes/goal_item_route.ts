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

const controller = new GoalItemController(
  createUseCase,
  getListUseCase,
  getUseCase,
  depositUseCase,
  markCompletedUseCase,
  updateUseCase,
  deleteUseCase,
);

router.post(
  "/goals",
  authMiddleware,
  validateBody(CreateGoalItemRequestSchema),
  controller.createGoalItem,
);

router.get("/goals", authMiddleware, controller.getGoalItemList);

router.get(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(GoalItemIdParamSchema),
  controller.getGoalItem,
);

router.patch(
  "/goals/complete/:goalItemID",
  authMiddleware,
  validateParams(GoalItemIdParamSchema),
  controller.markGoalItemCompleted,
);

router.patch(
  "/goals/deposit/:goalItemID",
  authMiddleware,
  validateBody(DepositGoalItemRequestSchema),
  controller.depositGoalItem,
);

router.patch(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(GoalItemIdParamSchema),
  validateBody(UpdateGoalItemRequestSchema),
  controller.updateGoalItem,
);

router.delete(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(GoalItemIdParamSchema),
  controller.deleteGoalItem,
);

export { router as goalItemRouter };
