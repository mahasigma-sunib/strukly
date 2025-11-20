import { Router } from "express";
import TransactionController from "../controllers/transaction_controller";
import {
  validateBody,
  validateParams,
} from "../middleware/validation_middleware";
import {
  CreateTransactionDTOSchema,
  TransactionDTOSchema,
} from "../dto/transaction_dto";
import { authMiddleware } from "../middleware/auth_middleware";
import TransactionService from "src/domain/services/transaction_service";
import PrismaTransactionRepository from "../repositories/prisma_transaction_repository";
import CreateTransactionUseCase from "src/application/use_cases/transaction/create_transaction";
import GetTransactionListUseCase from "src/application/use_cases/transaction/get_transaction_list";
import GetTransactionDetailUseCase from "src/application/use_cases/transaction/get_transaction_detail";
import z from "zod";
import UpdateTransactionUseCase from "src/application/use_cases/transaction/update_transaction";
import DeleteTransactionUseCase from "src/application/use_cases/transaction/delete_transaction";
import ScanTransactionImageUseCase from "src/application/use_cases/transaction/scan_transaction_image";
import GeminiLanguageModel from "../language_model/gemini_language_model";
import multer from "multer";

const router = Router();
const transactionRepository = new PrismaTransactionRepository();
const transactionService = new TransactionService(transactionRepository);
const languageModelService = new GeminiLanguageModel();
const createTransactionUseCase = new CreateTransactionUseCase(
  transactionService
);
const getTransactionListUseCase = new GetTransactionListUseCase(
  transactionService
);
const getTransactionDetailUseCase = new GetTransactionDetailUseCase(
  transactionService
);
const updateTransactionUseCase = new UpdateTransactionUseCase(
  transactionService
);
const deleteTransactionUseCase = new DeleteTransactionUseCase(
  transactionService
);
const imageToTransactionUseCase = new ScanTransactionImageUseCase(languageModelService);
const transactionController = new TransactionController(
  createTransactionUseCase,
  getTransactionListUseCase,
  getTransactionDetailUseCase,
  updateTransactionUseCase,
  deleteTransactionUseCase,
  imageToTransactionUseCase,
);

const transactionImageUpload = multer(); // store in memory
router.post(
  "/transactions/scan-image",
  authMiddleware,
  transactionImageUpload.single("image"),
  transactionController.scanTransactionImage
);

router.post(
  "/transactions",
  authMiddleware,
  validateBody(CreateTransactionDTOSchema), // Validates req.body against the schema
  transactionController.createTransaction
);

router.get(
  "/transactions",
  authMiddleware,
  transactionController.getTransactionList
);

router.get(
  "/transactions/:transactionID",
  authMiddleware,
  validateParams(z.object({ transactionID: z.uuid() })),
  transactionController.getTransactionDetail
);

router.put(
  "/transactions/:transactionID",
  authMiddleware,
  validateParams(z.object({ transactionID: z.uuid() })),
  validateBody(TransactionDTOSchema),
  transactionController.updateTransaction
);

router.delete(
  "/transactions/:transactionID",
  authMiddleware,
  validateParams(z.object({ transactionID: z.uuid() })),
  transactionController.deleteTransaction
);

export { router as transactionRouter };
