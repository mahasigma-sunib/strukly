import LanguageModelService from "src/application/services/language_model_service";
import { CreateExpenseRequest } from "src/infrastructure/schemas";

export default class ScanExpenseImageUseCase {
  constructor(private readonly languageModelService: LanguageModelService) { }

  public async execute(base64Image: string): Promise<CreateExpenseRequest> {
    const expenseData = await this.languageModelService.imageToExpense(base64Image);
    return expenseData;
  }
}