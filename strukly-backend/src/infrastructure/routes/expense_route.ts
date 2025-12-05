import { Router } from "express";
import ExpenseController from "../controllers/expense_controller";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation_middleware";
import {
  CreateExpenseRequestSchema,
  ExpenseResponseSchema,
  ExpenseReportQuerySchema,
  ExpenseIdParamSchema,
} from "../schemas";
import { authMiddleware } from "../middleware/auth_middleware";
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
  validateBody(CreateExpenseRequestSchema),
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
  validateQuery(ExpenseReportQuerySchema),
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
  validateParams(ExpenseIdParamSchema),
  expenseController.getExpenseDetail
);

router.put(
  "/expenses/:expenseID",
  authMiddleware,
  validateParams(ExpenseIdParamSchema),
  validateBody(ExpenseResponseSchema),
  expenseController.updateExpense
);

router.delete(
  "/expenses/:expenseID",
  authMiddleware,
  validateParams(ExpenseIdParamSchema),
  expenseController.deleteExpense
);

export { router as expenseRouter };
