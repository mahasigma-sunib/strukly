import LanguageModelService from "src/application/services/language_model_service";
import { CreateFromVLLMTransactionDTO } from "src/infrastructure/dto/transaction_dto";

export default class ScanTransactionImageUseCase {
  constructor(private readonly languageModelService: LanguageModelService) { }

  public async execute(base64Image: string): Promise<CreateFromVLLMTransactionDTO> {
    const transactionData = await this.languageModelService.imageToTransaction(base64Image);
    return transactionData;
  }
}