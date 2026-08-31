import FallbackVisionAdapter from "../infrastructure/language_model/fallback_vision_adapter";
import VisionExtractionPort from "../application/services/vision_extraction_port";
import { ReceiptExtractionTask } from "../application/language_model/receipt_extraction_task";
import ServiceUnavailableError from "../domain/errors/ServiceUnavailableError";

const task: ReceiptExtractionTask = {
  imageBase64: "abc123",
  mimeType: "image/png",
  instructions: "extract data",
  outputJsonSchema: { type: "object" },
};

const mockResult = { vendorName: "Test" };

describe("FallbackVisionAdapter", () => {
  it("returns primary result on success", async () => {
    const primary: VisionExtractionPort = {
      extractReceipt: jest.fn().mockResolvedValue(mockResult),
    };
    const fallback: VisionExtractionPort = {
      extractReceipt: jest.fn(),
    };

    const adapter = new FallbackVisionAdapter(primary, fallback);
    const result = await adapter.extractReceipt(task);

    expect(result).toEqual(mockResult);
    expect(primary.extractReceipt).toHaveBeenCalledWith(task);
    expect(fallback.extractReceipt).not.toHaveBeenCalled();
  });

  it("falls back on HTTP errors", async () => {
    const primary: VisionExtractionPort = {
      extractReceipt: jest.fn().mockRejectedValue(new Error("rate limited")),
    };
    const fallback: VisionExtractionPort = {
      extractReceipt: jest.fn().mockResolvedValue(mockResult),
    };

    const adapter = new FallbackVisionAdapter(primary, fallback);
    const result = await adapter.extractReceipt(task);

    expect(result).toEqual(mockResult);
    expect(fallback.extractReceipt).toHaveBeenCalledWith(task);
  });

  it("falls back on network errors", async () => {
    const primary: VisionExtractionPort = {
      extractReceipt: jest.fn().mockRejectedValue(new Error("fetch failed")),
    };
    const fallback: VisionExtractionPort = {
      extractReceipt: jest.fn().mockResolvedValue(mockResult),
    };

    const adapter = new FallbackVisionAdapter(primary, fallback);
    const result = await adapter.extractReceipt(task);

    expect(result).toEqual(mockResult);
    expect(fallback.extractReceipt).toHaveBeenCalledWith(task);
  });

  it("falls back on any primary failure", async () => {
    const primary: VisionExtractionPort = {
      extractReceipt: jest.fn().mockRejectedValue(new Error("unauthorized")),
    };
    const fallback: VisionExtractionPort = {
      extractReceipt: jest.fn().mockResolvedValue(mockResult),
    };

    const adapter = new FallbackVisionAdapter(primary, fallback);
    const result = await adapter.extractReceipt(task);

    expect(result).toEqual(mockResult);
    expect(fallback.extractReceipt).toHaveBeenCalledWith(task);
  });

  it("returns service unavailable when both providers fail", async () => {
    const primary: VisionExtractionPort = {
      extractReceipt: jest.fn().mockRejectedValue(new Error("rate limited")),
    };
    const fallback: VisionExtractionPort = {
      extractReceipt: jest.fn().mockRejectedValue(new Error("offline")),
    };

    const adapter = new FallbackVisionAdapter(primary, fallback);

    await expect(adapter.extractReceipt(task)).rejects.toThrow(
      ServiceUnavailableError,
    );
  });
});
