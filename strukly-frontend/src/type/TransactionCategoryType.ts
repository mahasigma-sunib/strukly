export interface TransactionCategoryType {
  id: string;
  categoryName: string;
  amount: number;
  type: 'expense' | 'income'
}
