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
 *             type: object
 *             required:
 *               - vendorName
 *               - category
 *               - dateTime
 *               - subtotalAmount
 *               - taxAmount
 *               - discountAmount
 *               - serviceAmount
 *               - items
 *             properties:
 *               vendorName:
 *                 type: string
 *               category:
 *                 type: string
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *               subtotalAmount:
 *                 $ref: '#/components/schemas/Money'
 *               taxAmount:
 *                 $ref: '#/components/schemas/Money'
 *               discountAmount:
 *                 $ref: '#/components/schemas/Money'
 *               serviceAmount:
 *                 $ref: '#/components/schemas/Money'
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - quantity
 *                     - singlePrice
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     singlePrice:
 *                       $ref: '#/components/schemas/Money'
 *     responses:
 *       201:
 *         description: Expense created successfully
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
 *     responses:
 *       200:
 *         description: Weekly report
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
 */
router.put(
  "/expenses/:expenseID",
  authMiddleware,
  validateParams(ExpenseIdParamSchema),
  validateBody(ExpenseResponseSchema),
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
