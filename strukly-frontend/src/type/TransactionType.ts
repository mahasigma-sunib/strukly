import type { TransactionItemType } from "./TransactionItemType";

export interface TransactionType {
  id: string;
  userId: string;
  walletId: string //sumber dana
  name: string;
  date: Date;
  items: TransactionItemType[];
  subtotal: number;
  discount: number;
  tax: number;
  serviceCharge: number;
  total: number;
  category: string;
}
