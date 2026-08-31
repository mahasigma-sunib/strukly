type ExpenseCategories =
  | "food"
  | "groceries"
  | "transportation"
  | "housebills"
  | "shopping"
  | "entertainment"
  | "others";

export const EXPENSE_CATEGORIES: readonly ExpenseCategories[] = [
  "food",
  "groceries",
  "transportation",
  "housebills",
  "shopping",
  "entertainment",
  "others",
] as const;

export default class ExpenseCategory {
  constructor(public readonly value: ExpenseCategories) {}
  static fromString(value: string): ExpenseCategory {
    if (EXPENSE_CATEGORIES.includes(value as ExpenseCategories)) {
      return new ExpenseCategory(value as ExpenseCategories);
    }
    throw new Error(`Invalid expense category: ${value}`);
  }
}
