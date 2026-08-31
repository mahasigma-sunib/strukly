import VisionExtractionPort from "src/application/services/vision_extraction_port";
import { buildScanExpenseImagePrompt } from "src/application/prompts/scan_expense_image_prompt";
import { receiptExtractionJsonSchema } from "src/application/schemas/receipt_extraction_json_schema";
import { EXPENSE_CATEGORIES } from "src/domain/values/expense_category";
import { toClientFacingError } from "src/infrastructure/language_model/client_facing_errors";
import { CreateExpenseRequest } from "src/infrastructure/schemas";

export default class ScanExpenseImageUseCase {
  constructor(private readonly visionExtractionPort: VisionExtractionPort) {}

  public async execute(
    base64Image: string,
    mimeType: string,
  ): Promise<CreateExpenseRequest> {
    const task = {
      imageBase64: base64Image,
      mimeType,
      instructions: buildScanExpenseImagePrompt(EXPENSE_CATEGORIES),
      outputJsonSchema: receiptExtractionJsonSchema,
    };

    try {
      return await this.visionExtractionPort.extractReceipt(task);
    } catch (err) {
      toClientFacingError(err);
    }
  }
}
