import { Router } from 'express';
import TransactionController from '../controllers/transaction_controller';
import { validateBody } from '../middleware/validation_middleware';
import { CreateTransactionDTOSchema } from '../dto/transaction_dto';
import { authMiddleware } from '../middleware/auth_middleware';
import TransactionService from 'src/domain/services/transaction_service';
import PrismaTranactionRepository from '../repositories/prisma_transaction_repository';
import CreateTransactionUseCase from 'src/application/use_cases/transaction/create_transaction';

const router = Router();
const transactionRepository = new PrismaTranactionRepository();
const transactionService = new TransactionService(transactionRepository);
const createTransactionUseCase = new CreateTransactionUseCase(transactionService)
const transactionController = new TransactionController(createTransactionUseCase);

router.post(
  '/transactions',
  authMiddleware,
  validateBody(CreateTransactionDTOSchema), // Validates req.body against the schema
  transactionController.createTransaction
);

// router.get(
//   '/transactions/:id',
//   validateParams(z.object({ id: z.string().uuid() })),
//   transactionController.getTransaction
// );

export { router as transactionRouter };