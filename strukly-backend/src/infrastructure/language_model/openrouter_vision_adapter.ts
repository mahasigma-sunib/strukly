import VisionExtractionPort from "src/application/services/vision_extraction_port";
import { ReceiptExtractionTask } from "src/application/language_model/receipt_extraction_task";
import {
  CreateExpenseRequest,
  CreateExpenseRequestSchema,
} from "src/infrastructure/schemas";
import OpenAI from "openai";

function buildOpenRouterResponseFormat(schema: Record<string, unknown>) {
  const { $schema: _, ...schemaBody } = schema;
  return {
    type: "json_schema" as const,
    json_schema: {
      name: "receipt_extraction",
      strict: true,
      schema: schemaBody,
    },
  };
}

export default class OpenRouterVisionAdapter implements VisionExtractionPort {
  private readonly client: OpenAI;

  constructor(
    apiKey: string,
    private readonly model: string,
    client?: OpenAI,
  ) {
    this.client =
      client ??
      new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://strukly.app",
          "X-OpenRouter-Title": "Strukly",
        },
      });
  }

  async extractReceipt(task: ReceiptExtractionTask): Promise<CreateExpenseRequest> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${task.mimeType};base64,${task.imageBase64}`,
              },
            },
            {
              type: "text",
              text: task.instructions,
            },
          ],
        },
      ],
      response_format: buildOpenRouterResponseFormat(task.outputJsonSchema),
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenRouter returned empty response");
    }

    return CreateExpenseRequestSchema.parse(JSON.parse(content));
  }
}
