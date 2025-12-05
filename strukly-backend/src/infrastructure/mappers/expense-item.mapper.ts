import ExpenseItem from "src/domain/entities/expense_item";
import { ExpenseItemResponse } from "../schemas/responses";
import { mapMoneyToResponse } from "./money.mapper";

export function mapExpenseItemToResponse(item: ExpenseItem): ExpenseItemResponse {
  return {
    id: item.id.value,
    name: item.name,
    quantity: item.quantity,
    singlePrice: mapMoneyToResponse(item.singlePrice),
    totalPrice: mapMoneyToResponse(item.totalPrice),
    expenseID: item.expenseID.value,
  };
}
