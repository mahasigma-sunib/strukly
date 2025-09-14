import Transaction from "../aggregates/transaction";
import IImageToTransactionPort from "../ports/image_to_transaction_port";
import ITransactionRepository from "../repositories/transaction_repository";

export default class TransactionService {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly imageToTransactionPort: IImageToTransactionPort,
  ) { }

  async createTransactionFromImage(base64Image: string) {
    const transaction = await this.imageToTransactionPort.imageToTransaction(base64Image);
    return
  }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    return {} as Transaction;
  }
}