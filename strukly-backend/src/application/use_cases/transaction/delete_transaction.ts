import TransactionService from "src/domain/services/transaction_service";
import TransactionID from "src/domain/values/transaction_id";
import UserID from "src/domain/values/user_id";

export default class DeleteTransactionUseCase {
  constructor(private readonly transactionService: TransactionService) { }

  async execute(userId: string, transactionId: string): Promise<void> {
    await this.transactionService.deleteTransactionByID(new UserID(userId), new TransactionID(transactionId));
  }
}