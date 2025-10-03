import { Router } from "express";
import TransactionController from "../controllers/transaction_controller";
import { validateBody, validateParams } from "../middleware/validation_middleware";
import { CreateTransactionDTOSchema } from "../dto/transaction_dto";
import { authMiddleware } from "../middleware/auth_middleware";
import TransactionService from "src/domain/services/transaction_service";
import PrismaTranactionRepository from "../repositories/prisma_transaction_repository";
import CreateTransactionUseCase from "src/application/use_cases/transaction/create_transaction";
import GetTransactionListUseCase from "src/application/use_cases/transaction/get_transaction_list";
import GetTransactionDetailUseCase from "src/application/use_cases/transaction/get_transaction_detail";
import z from "zod";

const router = Router();
const transactionRepository = new PrismaTranactionRepository();
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
const transactionController = new TransactionController(
  createTransactionUseCase,
  getTransactionListUseCase,
  getTransactionDetailUseCase
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
  '/transactions/:transactionID',
  authMiddleware,
  validateParams(z.object({ transactionID: z.string().uuid() })),
  transactionController.getTransactionDetail
);

export { router as transactionRouter };
