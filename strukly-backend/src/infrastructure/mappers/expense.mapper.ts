import Expense from "src/domain/aggregates/expense";
import ExpenseHeader from "src/domain/entities/expense_header";
import ExpenseItem from "src/domain/entities/expense_item";
import ExpenseCategory from "src/domain/values/expense_category";
import ExpenseID from "src/domain/values/expense_id";
import ExpenseItemID from "src/domain/values/expense_item_id";
import Money from "src/domain/values/money";
import UserID from "src/domain/values/user_id";
import { CreateExpenseRequest } from "../schemas/requests";
import { ExpenseResponse, HistoryItemResponse } from "../schemas/responses";
import { mapMoneyToResponse } from "./money.mapper";
import { mapExpenseItemToResponse } from "./expense-item.mapper";

// ============ Request -> Domain ============

/**
 * Map a CreateExpenseRequest + userID into a domain Expense aggregate.
 * Assumes the incoming request has already been validated by the controller layer.
 */
export function mapCreateExpenseRequestToExpense(userID: string, request: CreateExpenseRequest): Expense {
  const newExpense = new Expense(
    ExpenseHeader.new({
      userID: new UserID(userID),
      dateTime: new Date(request.dateTime),
      vendorName: request.vendorName,
      category: ExpenseCategory.fromString(request.category),
      subtotalAmount: Money.newWithDefault(request.subtotalAmount.amount),
      taxAmount: Money.newWithDefault(request.taxAmount.amount),
      discountAmount: Money.newWithDefault(request.discountAmount.amount),
      serviceAmount: Money.newWithDefault(request.serviceAmount.amount),
    }),
    []
  );

  for (const item of request.items) {
    newExpense.addItem(
      ExpenseItem.new({
        name: item.name,
        quantity: item.quantity,
        singlePrice: Money.newWithDefault(item.singlePrice.amount),
        expenseID: newExpense.getExpenseID(),
      })
    );
  }

  return newExpense;
}

/**
 * Map an ExpenseResponse into a domain Expense aggregate.
 */
export function mapExpenseResponseToExpense(response: ExpenseResponse): Expense {
  const expense = new Expense(
    new ExpenseHeader({
      id: new ExpenseID(response.id),
      userID: new UserID(response.userID),
      dateTime: new Date(response.dateTime),
      vendorName: response.vendorName,
      category: ExpenseCategory.fromString(response.category),
      subtotalAmount: Money.newWithDefault(response.subtotalAmount.amount),
      taxAmount: Money.newWithDefault(response.taxAmount.amount),
      discountAmount: Money.newWithDefault(response.discountAmount.amount),
      serviceAmount: Money.newWithDefault(response.serviceAmount.amount),
      totalAmount: Money.newWithDefault(response.totalAmount.amount),
    }),
    []
  );

  for (const item of response.items) {
    expense.addItem(
      new ExpenseItem({
        id: new ExpenseItemID(item.id),
        name: item.name,
        quantity: item.quantity,
        singlePrice: Money.newWithDefault(item.singlePrice.amount),
        totalPrice: Money.newWithDefault(item.totalPrice.amount),
        expenseID: expense.getExpenseID(),
      })
    );
  }

  return expense;
}

// ============ Domain -> Response ============

export function mapExpenseToResponse(expense: Expense): ExpenseResponse {
  return {
    id: expense.header.id.value,
    vendorName: expense.header.vendorName,
    category: expense.header.category.value,
    dateTime: expense.header.dateTime.toISOString(),

    subtotalAmount: mapMoneyToResponse(expense.header.subtotalAmount),
    taxAmount: mapMoneyToResponse(expense.header.taxAmount),
    discountAmount: mapMoneyToResponse(expense.header.discountAmount),
    serviceAmount: mapMoneyToResponse(expense.header.serviceAmount),
    totalAmount: mapMoneyToResponse(expense.header.totalAmount),

    userID: expense.header.userID.value,
    items: expense.items.map(mapExpenseItemToResponse),
  };
}

export function mapExpenseToHistoryItem(expense: Expense): HistoryItemResponse {
  return {
    user_id: expense.header.userID.value,
    id: expense.header.id.value,
    subtotal: expense.header.subtotalAmount.value,
    tax: expense.header.taxAmount.value,
    service: expense.header.serviceAmount.value,
    discount: expense.header.discountAmount.value,
    total_expense: expense.header.totalAmount.value,
    total_my_expense: expense.header.totalAmount.value,
    category: expense.header.category.value,
    datetime: expense.header.dateTime,
    members: [],
    vendor: expense.header.vendorName,
  };
}
