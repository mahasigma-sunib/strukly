import TransactionMapper from "src/application/services/transaction_mapper";
import TransactionService from "src/domain/services/transaction_service";
import UserID from "src/domain/values/user_id";
import { TransactionDTO } from "src/infrastructure/dto/transaction_dto";

export default class UpdateTransactionUseCase {
  constructor(private readonly transactionService: TransactionService) { }
  async execute(
    userID: string,
    transaction: TransactionDTO,
  ) {
    const updatedTransaction = TransactionMapper.fromDTO(
      transaction
    );

    return this.transactionService.updateTransaction(new UserID(userID), updatedTransaction);
  }
}