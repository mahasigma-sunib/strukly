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
import { ExpenseReportRequestQuerySchema } from "../dto/expense_report_dto";
import ScanExpenseImageUseCase from "src/application/use_cases/expense/scan_expense_image";
import GeminiLanguageModel from "../language_model/gemini_language_model";
import multer from "multer";

const router = Router();
const expenseRepository = new PrismaExpenseRepository();
const expenseService = new ExpenseService(expenseRepository);
const languageModelService = new GeminiLanguageModel();
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
const imageToExpenseUseCase = new ScanExpenseImageUseCase(
  languageModelService
);

const expenseController = new ExpenseController(
  createExpenseUseCase,
  getExpenseListUseCase,
  getExpenseDetailUseCase,
  updateExpenseUseCase,
  deleteExpenseUseCase,
  imageToExpenseUseCase
);

router.post(
  "/expenses",
  authMiddleware,
  validateBody(CreateExpenseDTOSchema), // Validates req.body against the schema
  expenseController.createExpense
);

const expenseImageUpload = multer(); // store in memory
router.post(
  "/expenses/scan-image",
  authMiddleware,
  expenseImageUpload.single("image"),
  expenseController.scanExpenseImage
);

router.get(
  "/expenses",
  authMiddleware,
  validateQuery(ExpenseReportRequestQuerySchema),
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
