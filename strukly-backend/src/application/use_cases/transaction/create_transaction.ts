import { CreateTransactionDTO } from "src/infrastructure/dto/transaction_dto";
import Transaction from "../../../domain/aggregates/transaction";
import TransactionService from "../../../domain/services/transaction_service";
import TransactionMapper from "src/application/services/transaction_mapper";

export default class CreateTransactionUseCase {
  constructor(private readonly transactionService: TransactionService) {}
  async execute(
    userID: string,
    transaction: CreateTransactionDTO,
  ) {
    const newTransaction: Transaction = TransactionMapper.fromCreateDTO(
      userID,
      transaction
    );

    return this.transactionService.createTransaction(newTransaction);
  }
}
