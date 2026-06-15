import { buildScanExpenseImagePrompt } from "../application/prompts/scan_expense_image_prompt";
import { EXPENSE_CATEGORIES } from "../domain/values/expense_category";

describe("buildScanExpenseImagePrompt", () => {
  it("includes all expense categories", () => {
    const prompt = buildScanExpenseImagePrompt(EXPENSE_CATEGORIES);

    for (const category of EXPENSE_CATEGORIES) {
      expect(prompt).toContain(`"${category}"`);
    }
  });

  it("includes schema field names and formatting instructions", () => {
    const prompt = buildScanExpenseImagePrompt(EXPENSE_CATEGORIES);

    expect(prompt).toContain("vendorName");
    expect(prompt).toContain("subtotalAmount");
    expect(prompt).toContain("items");
    expect(prompt).toContain("ISO 8601");
    expect(prompt).toContain("ISO 4217");
    expect(prompt).toContain("Do not use merchant, lineItems");
  });
});
