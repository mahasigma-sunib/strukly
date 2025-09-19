import TransactionService from "../../../domain/services/transaction_service";
import IImageToTransactionService from "../../services/image_to_transaction_service";

export default class CreateTransactionFromImageUseCase {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly imageToTransactionService: IImageToTransactionService
  ) { }
  async execute(base64Image: string) {
    const transaction = await this.imageToTransactionService.imageToTransaction(base64Image);
    return this.transactionService.createTransaction(transaction);
  }
}