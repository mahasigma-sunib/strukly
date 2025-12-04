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
import z from "zod";
import { ExpenseReportRequestQuerySchema } from "../dto/expense_report_dto";
import multer from "multer";
import {
  createExpenseUseCase,
  getExpenseListUseCase,
  getWeeklyExpenseReportUseCase,
  getExpenseDetailUseCase,
  updateExpenseUseCase,
  deleteExpenseUseCase,
  imageToExpenseUseCase,
} from "src/composition_root";

const router = Router();

const expenseController = new ExpenseController(
  createExpenseUseCase,
  getExpenseListUseCase,
  getWeeklyExpenseReportUseCase,
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
  "/expenses/weekly",
  authMiddleware,
  expenseController.getWeeklyReport
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
