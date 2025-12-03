import { Router } from "express";
import z from "zod";
import GoalItemController from "../controllers/goal_item_controllers";
import { authMiddleware } from "../middleware/auth_middleware";
import {
  validateBody,
  validateParams,
} from "../middleware/validation_middleware";

import {
  CreateGoalItemDTOSchema,
  UpdateGoalItemDTOSchema,
} from "../dto/goal_item_dto";
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
  validateBody(CreateGoalItemDTOSchema),
  controller.createGoalItem,
);

router.get("/goals", authMiddleware, controller.getGoalItemList);

router.get(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(z.object({ goalItemID: z.uuid() })),
  controller.getGoalItem,
);

router.patch(
  "/goals/complete/:goalItemID",
  authMiddleware,
  validateParams(z.object({ goalItemID: z.uuid() })),
  controller.markGoalItemCompleted,
);

router.patch(
  "/goals/deposit/:goalItemID",
  authMiddleware,
  validateBody(z.object({ amount: z.number() })),
  controller.depositGoalItem,
);

router.patch(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(z.object({ goalItemID: z.uuid() })),
  validateBody(UpdateGoalItemDTOSchema),
  controller.updateGoalItem,
);

router.delete(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(z.object({ goalItemID: z.uuid() })),
  controller.deleteGoalItem,
);

export { router as goalItemRouter };
