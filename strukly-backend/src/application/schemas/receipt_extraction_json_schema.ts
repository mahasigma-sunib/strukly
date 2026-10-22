import { toJSONSchema } from "zod";
import { CreateExpenseRequestSchema } from "src/infrastructure/schemas";

export const receiptExtractionJsonSchema = toJSONSchema(
  CreateExpenseRequestSchema,
) as Record<string, unknown>;
