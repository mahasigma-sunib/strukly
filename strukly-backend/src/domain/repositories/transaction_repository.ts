import Transaction from "../aggregates/transaction";
import TransactionID from "../values/transaction_id";
import UserID from "../values/user_id";

export default interface ITransactionRepository {
  create: (transaction: Transaction) => Promise<Transaction>;
  delete: (transactionID: TransactionID) => Promise<void>;
  findByID: (transactionID: TransactionID) => Promise<Transaction | null>;
  findByUserID: (userID: UserID) => Promise<Transaction[]>;
  update: (transaction: Transaction) => Promise<Transaction>;
}