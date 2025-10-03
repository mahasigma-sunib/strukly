import TransactionService from "src/domain/services/transaction_service";
import TransactionID from "src/domain/values/transaction_id";
import UserID from "src/domain/values/user_id";

export default class GetTransactionDetailUseCase {
  constructor(private readonly transactionService: TransactionService) { }
  async execute(userID: string, transactionID: string) {
    return this.transactionService.getTransactionByID(new UserID(userID), new TransactionID(transactionID));
  }
}