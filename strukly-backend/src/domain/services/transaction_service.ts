import Transaction from "../aggregates/transaction";
import ITransactionRepository from "../repositories/transaction_repository";
import TransactionID from "../values/transaction_id";
import UserID from "../values/user_id";

export default class TransactionService {
  constructor(private readonly transactionRepository: ITransactionRepository) { }
  async createTransaction(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.create(transaction);
  }
  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.update(transaction);
  }
  async getTransactionListByUserID(userID: UserID): Promise<Transaction[]> {
    return await this.transactionRepository.findByUserID(userID);
  }

  /**
   * Get transaction by ID, ensuring it belongs to the specified user.
   * @param userID 
   * @param transactionID 
   * @returns Transaction
   */
  async getTransactionByID(userID: UserID, transactionID: TransactionID): Promise<Transaction | null> {
    const transaction = await this.transactionRepository.findByID(transactionID);
    if (transaction && transaction.header.userID.equals(userID)) {
      return transaction;
    }
    return null;
  }
}
