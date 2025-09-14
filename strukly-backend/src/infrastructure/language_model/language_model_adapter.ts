import IImageToTransactionPort from "../../domain/ports/image_to_transaction_port";

export default class LanguageModelAdapter implements IImageToTransactionPort {
  constructor() { }
  async imageToTransaction(base64Image: string): Promise<any> {
  }
}