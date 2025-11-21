import LanguageModelService from "src/application/services/language_model_service";
import { CreateExpenseDTO } from "src/infrastructure/dto/expense_dto";

export default class ScanExpenseImageUseCase {
  constructor(private readonly languageModelService: LanguageModelService) { }

  public async execute(base64Image: string): Promise<CreateExpenseDTO> {
    const expenseData = await this.languageModelService.imageToExpense(base64Image);
    return expenseData;
  }
}