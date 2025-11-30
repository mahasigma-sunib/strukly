import type { ExpenseItemType } from "./ExpenseItemType";

export interface ExpenseType {
  userID: string;

  id: string;
  dateTime: Date;
  vendorName: string;
  category: string;

  currency: string;
  subtotalAmount: number;
  taxAmount: number;
  discountAmount: number;
  serviceAmount: number;
  totalAmount: number;

  items: ExpenseItemType[] | null;
}
