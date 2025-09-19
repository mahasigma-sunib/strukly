import Transaction from "../aggregates/transaction";
import TransactionDescriptor from "../entities/transaction_descriptor";
import ITransactionRepository from "../repositories/transaction_repository";

export default class TransactionService {
  constructor(private readonly transactionRepository: ITransactionRepository) {}
  async createTransaction(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.create(transaction);
  }
  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.update(transaction);
  }
}
