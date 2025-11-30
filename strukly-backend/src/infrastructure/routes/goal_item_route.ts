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
import DepositGoalItemUseCase from "src/application/use_cases/goal_item/deposit_goal_item";
import {
  CreateGoalItemDTOSchema,
  UpdateGoalItemDTOSchema,
} from "../dto/goal_item_dto";
import BudgetService from "src/domain/services/budget_service";
import PrismaUserRepository from "../repositories/prisma_user_repository";
import PrismaBudgetHistoryRepository from "../repositories/prisma_budget_history_repository";
import { PrismaClient } from "@prisma/client";
import MarkGoalItemCompletedUseCase from "src/application/use_cases/goal_item/mark_goal_item_completed";

const router = Router();

const goalItemRepo = new PrismaGoalItemRepository();
const budgetHistoryRepo = new PrismaBudgetHistoryRepository(new PrismaClient());
const userRepo = new PrismaUserRepository();

const budgetService = new BudgetService(userRepo, budgetHistoryRepo);

const createUseCase = new CreateGoalItemUseCase(goalItemRepo);
const getListUseCase = new GetGoalItemListUseCase(goalItemRepo);
const getUseCase = new GetGoalItemUseCase(goalItemRepo);
const depositUseCase = new DepositGoalItemUseCase(budgetService, goalItemRepo);
const markGoalItemCompletedUseCase = new MarkGoalItemCompletedUseCase(goalItemRepo);
const updateUseCase = new UpdateGoalItemUseCase(goalItemRepo);
const deleteUseCase = new DeleteGoalItemUseCase(goalItemRepo);

const controller = new GoalItemController(
  createUseCase,
  getListUseCase,
  getUseCase,
  depositUseCase,
  markGoalItemCompletedUseCase,
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
