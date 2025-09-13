import type { TransactionItemType } from "./TransactionItemType";

export interface TransactionType {
  id: string;
  categoryId: string;
  items: TransactionItemType[]
  tax: number;
  total: number;
}
