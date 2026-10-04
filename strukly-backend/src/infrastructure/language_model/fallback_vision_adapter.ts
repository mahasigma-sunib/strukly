import VisionExtractionPort from "src/application/services/vision_extraction_port";
import { ReceiptExtractionTask } from "src/application/language_model/receipt_extraction_task";
import { CreateExpenseRequest } from "src/infrastructure/schemas";
import { toClientFacingError } from "./client_facing_errors";

export default class FallbackVisionAdapter implements VisionExtractionPort {
  constructor(
    private readonly primary: VisionExtractionPort,
    private readonly fallback: VisionExtractionPort,
  ) {}

  async extractReceipt(task: ReceiptExtractionTask): Promise<CreateExpenseRequest> {
    try {
      return await this.primary.extractReceipt(task);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        "Primary vision provider failed, falling back to secondary:",
        err,
      );

      try {
        return await this.fallback.extractReceipt(task);
      } catch (fallbackErr) {
        toClientFacingError(fallbackErr);
      }
    }
  }
}
