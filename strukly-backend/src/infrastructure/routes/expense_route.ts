import { Router } from "express";
import ExpenseController from "../controllers/expense_controller";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation_middleware";
import {
  CreateExpenseDTOSchema,
  ExpenseDTOSchema,
} from "../dto/expense_dto";
import { authMiddleware } from "../middleware/auth_middleware";
import ExpenseService from "src/domain/services/expense_service";
import PrismaExpenseRepository from "../repositories/prisma_expense_repository";
import CreateExpenseUseCase from "src/application/use_cases/expense/create_expense";
import GetExpenseListUseCase from "src/application/use_cases/expense/get_expense_list";
import GetExpenseDetailUseCase from "src/application/use_cases/expense/get_expense_detail";
import z from "zod";
import UpdateExpenseUseCase from "src/application/use_cases/expense/update_expense";
import DeleteExpenseUseCase from "src/application/use_cases/expense/delete_expense";

const router = Router();
const expenseRepository = new PrismaExpenseRepository();
const expenseService = new ExpenseService(expenseRepository);
const createExpenseUseCase = new CreateExpenseUseCase(
  expenseService
);
const getExpenseListUseCase = new GetExpenseListUseCase(
  expenseService
);
const getExpenseDetailUseCase = new GetExpenseDetailUseCase(
  expenseService
);
const updateExpenseUseCase = new UpdateExpenseUseCase(
  expenseService
);
const deleteExpenseUseCase = new DeleteExpenseUseCase(
  expenseService
);
const expenseController = new ExpenseController(
  createExpenseUseCase,
  getExpenseListUseCase,
  getExpenseDetailUseCase,
  updateExpenseUseCase,
  deleteExpenseUseCase
);

router.post(
  "/expenses",
  authMiddleware,
  validateBody(CreateExpenseDTOSchema), // Validates req.body against the schema
  expenseController.createExpense
);

router.get(
  "/expenses",
  authMiddleware,
  validateQuery(z.object({ month: z.coerce.number().int().min(1).max(12), year: z.coerce.number().int().min(2000) })),
  expenseController.getExpenseList
);

router.get(
  "/expenses/:expenseID",
  authMiddleware,
  validateParams(z.object({ expenseID: z.uuid() })),
  expenseController.getExpenseDetail
);

router.put(
  "/expenses/:expenseID",
  authMiddleware,
  validateParams(z.object({ expenseID: z.uuid() })),
  validateBody(ExpenseDTOSchema),
  expenseController.updateExpense
);

router.delete(
  "/expenses/:expenseID",
  authMiddleware,
  validateParams(z.object({ expenseID: z.uuid() })),
  expenseController.deleteExpense
);

export { router as expenseRouter };
