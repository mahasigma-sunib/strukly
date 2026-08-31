export function buildScanExpenseImagePrompt(
  categories: readonly string[],
): string {
  const categoryList = categories.map((c) => `"${c}"`).join(", ");
  return `Extract all required expense data from the receipt image.
Use exactly these field names:
- vendorName: store or vendor name
- category: one of the allowed categories below
- dateTime: ISO 8601 datetime with UTC designator (Z)
- subtotalAmount, taxAmount, discountAmount, serviceAmount: each as { amount, currency }
- items: array of { name, quantity, singlePrice } where singlePrice is { amount, currency }
Do not include a total field. Do not use merchant, lineItems, description, subtotal, tax, or totalPrice.
Use 0 for discountAmount or serviceAmount when not shown on the receipt.
Ensure item quantities and singlePrice values are consistent with the receipt.
Currencies must be 3-letter ISO 4217 codes.
The possible categories are: ${categoryList};`;
}
