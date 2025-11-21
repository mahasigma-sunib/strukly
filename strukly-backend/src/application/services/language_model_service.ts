import { CreateExpenseDTO } from "src/infrastructure/dto/expense_dto";

export default interface LanguageModelService {
  imageToExpense: (base64Image: string) => Promise<CreateExpenseDTO>;
}