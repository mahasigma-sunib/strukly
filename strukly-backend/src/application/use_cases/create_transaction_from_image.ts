import TransactionService from "../../domain/services/transaction_service";

export default class CreateTransactionFromImage {
  constructor(private readonly transactionService: TransactionService) { }
  async execute(base64Image: string) {
    this.transactionService.createTransactionFromImage(base64Image);
  }
}