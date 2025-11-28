import { Router } from "express";
import z from "zod";
import GoalItemController from "../controllers/goal_item_controllers";
import { authMiddleware } from "../middleware/auth_middleware";
import {
  validateBody,
  validateParams,
} from "../middleware/validation_middleware";

import PrismaGoalItemRepository from "../repositories/prisma_goal_item_repository";
import CreateGoalItemUseCase from "src/application/use_cases/goal_item/create_goal_item";
import GetGoalItemUseCase from "src/application/use_cases/goal_item/get_goal_item";
import UpdateGoalItemUseCase from "src/application/use_cases/goal_item/update_goal_item";
import DeleteGoalItemUseCase from "src/application/use_cases/goal_item/delete_goal_item";
import GetGoalItemListUseCase from "src/application/use_cases/goal_item/get_goal_item_list";

const router = Router();

const repo = new PrismaGoalItemRepository();
const createUseCase = new CreateGoalItemUseCase(repo);
const getListUseCase = new GetGoalItemListUseCase(repo);
const getUseCase = new GetGoalItemUseCase(repo);
const updateUseCase = new UpdateGoalItemUseCase(repo);
const deleteUseCase = new DeleteGoalItemUseCase(repo);

const controller = new GoalItemController(
  createUseCase,
  getListUseCase,
  getUseCase,
  updateUseCase,
  deleteUseCase,
);

const CreateGoalItemSchema = z.object({
  name: z.string(),
  price: z.number().int().positive(),
});

const UpdateGoalItemSchema = z.object({
  name: z.string().optional(),
  price: z.number().int().positive().optional(),
});

const ParamsSchema = z.object({ goalItemID: z.string().uuid() });

router.post(
  "/goals",
  authMiddleware,
  validateBody(CreateGoalItemSchema),
  controller.createGoalItem,
);

router.get("/goals", authMiddleware, controller.getGoalItemList);

router.get(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(ParamsSchema),
  controller.getGoalItem,
);

router.patch(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(ParamsSchema),
  validateBody(UpdateGoalItemSchema),
  controller.updateGoalItem,
);

router.delete(
  "/goals/:goalItemID",
  authMiddleware,
  validateParams(ParamsSchema),
  controller.deleteGoalItem,
);

export { router as goalItemRouter };
