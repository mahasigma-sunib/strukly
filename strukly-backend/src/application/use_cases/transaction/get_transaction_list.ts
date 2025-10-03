import TransactionService from "src/domain/services/transaction_service";
import UserID from "src/domain/values/user_id";

export default class GetTransactionListUseCase {
  constructor(private readonly transactionService: TransactionService) { }
  async execute(userID: string) {
    return this.transactionService.getTransactionListByUserID(new UserID(userID));
  }
}