import { Router } from "express";
import ExpenseController from "../controllers/expense_controller";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation_middleware";
import {
  CreateExpenseRequestSchema,
  UpdateExpenseRequestSchema,
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

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management
 */

const expenseController = new ExpenseController(
  createExpenseUseCase,
  getExpenseListUseCase,
  getWeeklyExpenseReportUseCase,
  getExpenseDetailUseCase,
  updateExpenseUseCase,
  deleteExpenseUseCase,
  imageToExpenseUseCase
);

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpenseRequest'
 *     responses:
 *       201:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 expense:
 *                   $ref: '#/components/schemas/ExpenseResponse'
 */
router.post(
  "/expenses",
  authMiddleware,
  validateBody(CreateExpenseRequestSchema),
  expenseController.createExpense
);

const expenseImageUpload = multer(); // store in memory
/**
 * @swagger
 * /expenses/scan-image:
 *   post:
 *     summary: Scan an expense receipt image
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Scanned expense data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   $ref: '#/components/schemas/CreateExpenseRequest'
 *       400:
 *         description: Image is required
 */
router.post(
  "/expenses/scan-image",
  authMiddleware,
  expenseImageUpload.single("image"),
  expenseController.scanExpenseImage
);

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get expense list (report)
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *         description: Month (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Year
 *     responses:
 *       200:
 *         description: List of expenses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseReportResponse'
 */
router.get(
  "/expenses",
  authMiddleware,
  validateQuery(ExpenseReportQuerySchema),
  expenseController.getExpenseList
);

/**
 * @swagger
 * /expenses/weekly:
 *   get:
 *     summary: Get weekly expense report
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Optional reference date (YYYY-MM-DD). Defaults to the current week when omitted.
 *     responses:
 *       200:
 *         description: Weekly report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                 totalSpent:
 *                   type: number
 *                 daily:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: Daily totals starting from Monday.
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HistoryItemResponse'
 *       400:
 *         description: Invalid date format
 */
router.get(
  "/expenses/weekly",
  authMiddleware,
  expenseController.getWeeklyReport
);

/**
 * @swagger
 * /expenses/{expenseID}:
 *   get:
 *     summary: Get expense detail
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: expenseID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the expense
 *     responses:
 *       200:
 *         description: Expense detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseResponse'
 *       404:
 *         description: Expense not found
 */
router.get(
  "/expenses/:expenseID",
  authMiddleware,
  validateParams(ExpenseIdParamSchema),
  expenseController.getExpenseDetail
);

/**
 * @swagger
 * /expenses/{expenseID}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: expenseID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseResponse'
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 expense:
 *                   $ref: '#/components/schemas/ExpenseResponse'
 *       400:
 *         description: Validation error or mismatched expense ID
 */
router.put(
  "/expenses/:expenseID",
  authMiddleware,
  validateParams(ExpenseIdParamSchema),
  validateBody(UpdateExpenseRequestSchema),
  expenseController.updateExpense
);

/**
 * @swagger
 * /expenses/{expenseID}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: expenseID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the expense
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 */
router.delete(
  "/expenses/:expenseID",
  authMiddleware,
  validateParams(ExpenseIdParamSchema),
  expenseController.deleteExpense
);

export { router as expenseRouter };
