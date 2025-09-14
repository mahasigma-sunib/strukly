import type { TransactionItemType } from "./TransactionItemType";

export interface TransactionType {
  id: string;
  categoryId: string;
  date: Date;
  items: TransactionItemType[];
  tax: number;
  serviceCharge: number;
  total: number;
}
