import Transaction from "../aggregates/transaction";

export default interface IImageToTransactionPort {
  imageToTransaction: (base64Image: string) => Promise<Transaction[]>;
}