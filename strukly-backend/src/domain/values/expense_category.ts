type ExpenseCategories =
  | "food"
  | "groceries"
  | "transportation"
  | "housebills"
  | "shopping"
  | "entertainment"
  | "others";

export default class ExpenseCategory {
  constructor(public readonly value: ExpenseCategories) {}
  static fromString(value: string): ExpenseCategory {
    const validCategories: ExpenseCategories[] = [
      "food",
      "groceries",
      "transportation",
      "housebills",
      "shopping",
      "entertainment",
      "others",
    ];
    if (validCategories.includes(value as ExpenseCategories)) {
      return new ExpenseCategory(value as ExpenseCategories);
    }
    throw new Error(`Invalid expense category: ${value}`);
  }
}
