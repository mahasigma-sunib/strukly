import type { ExpenseType } from "../type/ExpenseType";
import type { ExpenseItemType } from "../type/ExpenseItemType";

export const EXPENSE_CSV_HEADER =
  "Date,Time,Vendor,Category,Currency,Subtotal,Tax,Service,Discount,Total,Items";

export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function formatCsvDate(dateTime: Date): string {
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const day = String(dateTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatCsvTime(dateTime: Date): string {
  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatItemsSummary(items: ExpenseItemType[]): string {
  return items
    .map((item) => `${item.quantity}x ${item.name} @${item.singleItemPrice}`)
    .join("; ");
}

function formatAmount(value: number): string {
  return String(value ?? 0);
}

export function buildExpensesCsv(expenses: ExpenseType[]): string {
  const rows = [...expenses]
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    )
    .map((expense) => {
      const fields = [
        formatCsvDate(expense.dateTime),
        formatCsvTime(expense.dateTime),
        expense.vendorName,
        expense.category,
        expense.currency.trim(),
        formatAmount(expense.subtotalAmount),
        formatAmount(expense.taxAmount),
        formatAmount(expense.serviceAmount),
        formatAmount(expense.discountAmount),
        formatAmount(expense.totalAmount),
        formatItemsSummary(expense.items ?? []),
      ];
      return fields.map(escapeCsvField).join(",");
    });

  return [EXPENSE_CSV_HEADER, ...rows].join("\n");
}

export function buildExpensesCsvFilename(month: number, year: number): string {
  return `koinku-expenses-${year}-${String(month).padStart(2, "0")}.csv`;
}
