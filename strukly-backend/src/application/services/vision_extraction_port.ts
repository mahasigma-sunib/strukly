import { ReceiptExtractionTask } from "../language_model/receipt_extraction_task";
import { CreateExpenseRequest } from "src/infrastructure/schemas";

export default interface VisionExtractionPort {
  extractReceipt(task: ReceiptExtractionTask): Promise<CreateExpenseRequest>;
}
