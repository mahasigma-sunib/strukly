import type { TransactionItemType } from "./TransactionItemType";

export interface TransactionType {
  id: string;
  categoryId: string;
  walletId: string //sumber dana
  name: string;
  date: Date;
  items: TransactionItemType[];
  tax: number;
  serviceCharge: number;
  total: number;
}
