import { Router } from "express";
import GoalItemController from "../controllers/goal_item_controller";
import { authMiddleware } from "../middleware/auth_middleware";
import { validateBody } from "../middleware/validation_middleware";
import { CreateGoalItemDTOSchema } from "../dto/goal_item_dto";
import CreateGoalItemUseCase from "src/application/use_cases/goal_item/create_goal_item";
import GoalService from "src/domain/services/goal_service";
import PrismaGoalItemRepository from "../repositories/prisma_goal_item_repository";

const router = Router();

const goalItemRepository = new PrismaGoalItemRepository()
const goalService = new GoalService(goalItemRepository)
const createGoalItemUseCase = new CreateGoalItemUseCase(goalService)
const goalItemController = new GoalItemController(createGoalItemUseCase)

router.post("/goal",
    authMiddleware,
    validateBody(CreateGoalItemDTOSchema),
    goalItemController.createGoalItem
);

export { router as goalRouter };