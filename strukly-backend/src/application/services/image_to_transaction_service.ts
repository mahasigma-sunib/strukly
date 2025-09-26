import Transaction from "../../domain/aggregates/transaction";

export default interface IImageToTransactionService {
  imageToTransaction: (base64Image: string) => Promise<Transaction>;
}