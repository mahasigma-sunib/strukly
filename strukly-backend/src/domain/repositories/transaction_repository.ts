import Transaction from "../aggregates/transaction";
import TransactionDescriptor from "../entities/transaction_descriptor";
import TransactionItem from "../entities/transaction_item";

export default interface ITransactionRepository {
  createTransaction: (transactionDescriptor: TransactionDescriptor, transactionItems: TransactionItem[]) => Promise<Transaction>;
}