import { CreateTransactionDTO } from "src/infrastructure/dto/transaction_dto";
import Transaction from "../../../domain/aggregates/transaction";
import TransactionService from "../../../domain/services/transaction_service";


export default class CreateTransactionUseCase {
  constructor(private readonly transactionService: TransactionService) {}
  async execute(
    userID: string,
    transaction: CreateTransactionDTO,
  ) {

    // Delegate DTO -> Domain mapping to the application-layer mapper
    const { default: TransactionMapper } = await import(
      "src/application/services/transaction_mapper"
    );

    const newTransaction: Transaction = TransactionMapper.fromCreateDTO(
      userID,
      transaction
    );

    return this.transactionService.createTransaction(newTransaction);
  }
}
