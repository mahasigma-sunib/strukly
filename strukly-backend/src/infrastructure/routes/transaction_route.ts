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

const router = Router();
const transactionRepository = new PrismaTransactionRepository();
const transactionService = new TransactionService(transactionRepository);
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
const transactionController = new TransactionController(
  createTransactionUseCase,
  getTransactionListUseCase,
  getTransactionDetailUseCase,
  updateTransactionUseCase,
  deleteTransactionUseCase
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
