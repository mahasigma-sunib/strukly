import type { BudgetType } from "./BudgetType";

export interface TransactionCategoryType {
  id: string;
  budget: BudgetType;
  categoryName: string;
  amount: number;
  type: 'expense' | 'income'
}
