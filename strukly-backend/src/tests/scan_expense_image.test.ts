import ScanExpenseImageUseCase from "../application/use_cases/expense/scan_expense_image";
import VisionExtractionPort from "../application/services/vision_extraction_port";
import { EXPENSE_CATEGORIES } from "../domain/values/expense_category";

const validExpenseData = {
  vendorName: "Lunch Spot",
  category: "food",
  dateTime: "2023-10-27T10:00:00.000Z",
  subtotalAmount: { amount: 100, currency: "IDR" },
  taxAmount: { amount: 0, currency: "IDR" },
  discountAmount: { amount: 0, currency: "IDR" },
  serviceAmount: { amount: 0, currency: "IDR" },
  items: [
    {
      name: "Nasi Goreng",
      quantity: 1,
      singlePrice: { amount: 100, currency: "IDR" },
    },
  ],
};

describe("ScanExpenseImageUseCase", () => {
  it("builds task with all categories and validates adapter output", async () => {
    const visionExtractionPort: VisionExtractionPort = {
      extractReceipt: jest.fn().mockResolvedValue(validExpenseData),
    };
    const useCase = new ScanExpenseImageUseCase(visionExtractionPort);

    const result = await useCase.execute("base64data", "image/png");

    expect(result).toEqual(validExpenseData);
    expect(visionExtractionPort.extractReceipt).toHaveBeenCalledWith(
      expect.objectContaining({
        imageBase64: "base64data",
        mimeType: "image/png",
        instructions: expect.stringContaining(`"${EXPENSE_CATEGORIES[0]}"`),
        outputJsonSchema: expect.objectContaining({ type: "object" }),
      }),
    );
  });

  it("maps ZodError from adapter to UnprocessableReceiptError", async () => {
    const { ZodError } = await import("zod");
    const visionExtractionPort: VisionExtractionPort = {
      extractReceipt: jest.fn().mockRejectedValue(new ZodError([])),
    };
    const useCase = new ScanExpenseImageUseCase(visionExtractionPort);

    await expect(useCase.execute("base64data", "image/png")).rejects.toThrow(
      "Could not extract valid expense data from the image.",
    );
  });

  it("maps unknown adapter errors to ServiceUnavailableError", async () => {
    const visionExtractionPort: VisionExtractionPort = {
      extractReceipt: jest.fn().mockRejectedValue(new Error("network down")),
    };
    const useCase = new ScanExpenseImageUseCase(visionExtractionPort);

    await expect(useCase.execute("base64data", "image/png")).rejects.toThrow(
      "Receipt scanning is temporarily unavailable. Please try again later.",
    );
  });
});
