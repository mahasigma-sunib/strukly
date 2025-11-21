import Expense from "../../domain/aggregates/expense";

export default interface IImageToExpenseService {
  imageToExpense: (base64Image: string) => Promise<Expense>;
}