type ExpenseCategories = "food" | "entertainment" | "health" | "lifestyle";

export default class ExpenseCategory {
  constructor(public readonly value: ExpenseCategories) {}
  static fromString(value: string): ExpenseCategory {
    const validCategories: ExpenseCategories[] = [
      "food",
      "entertainment",
      "health",
      "lifestyle",
    ];
    if (validCategories.includes(value as ExpenseCategories)) {
      return new ExpenseCategory(value as ExpenseCategories);
    }
    throw new Error(`Invalid expense category: ${value}`);
  }
}
