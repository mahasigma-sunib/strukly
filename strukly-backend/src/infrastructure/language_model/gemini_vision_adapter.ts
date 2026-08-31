import VisionExtractionPort from "src/application/services/vision_extraction_port";
import { ReceiptExtractionTask } from "src/application/language_model/receipt_extraction_task";
import {
  CreateExpenseRequest,
  CreateExpenseRequestSchema,
} from "src/infrastructure/schemas";
import { ContentListUnion, GoogleGenAI, ThinkingLevel } from "@google/genai";

export default class GeminiVisionAdapter implements VisionExtractionPort {
  private readonly ai: GoogleGenAI;

  constructor(
    apiKey: string,
    private readonly model: string,
  ) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async extractReceipt(task: ReceiptExtractionTask): Promise<CreateExpenseRequest> {
    const config = {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW,
      },
      responseMimeType: "application/json",
      responseJsonSchema: task.outputJsonSchema,
    };

    const contents: ContentListUnion = [
      {
        inlineData: {
          mimeType: task.mimeType,
          data: task.imageBase64,
        },
      },
      { text: task.instructions },
    ];

    const response = await this.ai.models.generateContent({
      model: this.model,
      config,
      contents,
    });

    const text = response.text;
    if (!text) {
      throw new SyntaxError("Gemini returned empty response");
    }

    return CreateExpenseRequestSchema.parse(JSON.parse(text));
  }
}
