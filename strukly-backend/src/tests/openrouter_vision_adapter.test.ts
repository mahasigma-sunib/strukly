import OpenRouterVisionAdapter from "../infrastructure/language_model/openrouter_vision_adapter";
import { ReceiptExtractionTask } from "../application/language_model/receipt_extraction_task";
import OpenAI, { RateLimitError } from "openai";
import { ZodError } from "zod";

const task: ReceiptExtractionTask = {
  imageBase64: "abc123",
  mimeType: "image/png",
  instructions: "extract data",
  outputJsonSchema: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    properties: { vendorName: { type: "string" } },
  },
};

const mockResult = {
  vendorName: "Test Shop",
  category: "food",
  dateTime: "2023-10-27T10:00:00.000Z",
  subtotalAmount: { amount: 100, currency: "IDR" },
  taxAmount: { amount: 0, currency: "IDR" },
  discountAmount: { amount: 0, currency: "IDR" },
  serviceAmount: { amount: 0, currency: "IDR" },
  items: [],
};

function createMockClient(createImpl: jest.Mock) {
  return {
    chat: {
      completions: {
        create: createImpl,
      },
    },
  } as unknown as OpenAI;
}

describe("OpenRouterVisionAdapter", () => {
  it("calls OpenAI SDK with vision content and json_schema response format", async () => {
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockResult) } }],
    });
    const adapter = new OpenRouterVisionAdapter("test-key", "test-model", createMockClient(create));

    const result = await adapter.extractReceipt(task);

    expect(result).toEqual(mockResult);
    expect(create).toHaveBeenCalledWith({
      model: "test-model",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: "data:image/png;base64,abc123" },
            },
            { type: "text", text: "extract data" },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "receipt_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: { vendorName: { type: "string" } },
          },
        },
      },
    });
  });

  it("throws when OpenRouter returns empty response", async () => {
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: "" } }],
    });
    const adapter = new OpenRouterVisionAdapter("test-key", "test-model", createMockClient(create));

    await expect(adapter.extractReceipt(task)).rejects.toThrow(
      "OpenRouter returned empty response",
    );
  });

  it("rejects model output that does not match CreateExpenseRequest", async () => {
    const create = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              merchant: "Test Shop",
              lineItems: [],
            }),
          },
        },
      ],
    });
    const adapter = new OpenRouterVisionAdapter("test-key", "test-model", createMockClient(create));

    await expect(adapter.extractReceipt(task)).rejects.toThrow(ZodError);
  });

  it("propagates OpenAI API errors", async () => {
    const rateLimitError = new RateLimitError(
      429,
      undefined,
      "rate limited",
      new Headers(),
    );
    const create = jest.fn().mockRejectedValue(rateLimitError);
    const adapter = new OpenRouterVisionAdapter("test-key", "test-model", createMockClient(create));

    await expect(adapter.extractReceipt(task)).rejects.toThrow(RateLimitError);
  });
});
