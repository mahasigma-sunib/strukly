import { CreateExpenseRequest } from "src/infrastructure/schemas";

export default interface LanguageModelService {
  imageToExpense: (base64Image: string) => Promise<CreateExpenseRequest>;
}