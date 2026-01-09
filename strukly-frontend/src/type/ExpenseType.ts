import type { ExpenseItemType } from "./ExpenseItemType";
import type { CategoryKey } from "../utils/CategoryConfig";
export interface ExpenseType {
  userID: string;

  id: string;
  dateTime: Date;
  vendorName: string;
  category: CategoryKey;

  currency: string;
  subtotalAmount: number;
  taxAmount: number;
  discountAmount: number;
  serviceAmount: number;
  totalAmount: number;

  items: ExpenseItemType[];
}
