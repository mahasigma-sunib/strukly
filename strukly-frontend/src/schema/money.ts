export const MAX_MONEY_AMOUNT = 99_999_999_999;
export const MAX_ITEM_QUANTITY = 9_999;

export const MONEY_AMOUNT_TOO_LARGE = `Amount cannot exceed Rp ${MAX_MONEY_AMOUNT.toLocaleString("id-ID")}`;

export function clampMoney(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(MAX_MONEY_AMOUNT, value);
}

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(MAX_ITEM_QUANTITY, Math.trunc(value));
}

export function parseDigitAmount(rawInput: string): number {
  const digits = rawInput
    .replace(/[^\d]/g, "")
    .slice(0, String(MAX_MONEY_AMOUNT).length);
  return digits === "" ? 0 : clampMoney(Number(digits));
}

export function clampItemAmounts(price: number, quantity: number) {
  const singleItemPrice = clampMoney(price);
  let qty = clampQuantity(quantity);

  if (singleItemPrice > 0 && singleItemPrice * qty > MAX_MONEY_AMOUNT) {
    qty = Math.max(1, Math.floor(MAX_MONEY_AMOUNT / singleItemPrice));
  }

  return {
    singleItemPrice,
    quantity: qty,
    totalPrice: clampMoney(singleItemPrice * qty),
  };
}

export function clampExpenseMoneyFields<
  T extends {
    subtotalAmount: number;
    taxAmount: number;
    discountAmount: number;
    serviceAmount: number;
    totalAmount: number;
    items: Array<{
      singleItemPrice: number;
      quantity: number;
      totalPrice: number;
    }>;
  }
>(expense: T): T {
  const items = expense.items.map((item) => ({
    ...item,
    ...clampItemAmounts(item.singleItemPrice, item.quantity),
  }));
  const subtotalAmount = clampMoney(
    items.reduce((sum, item) => sum + item.totalPrice, 0)
  );

  return {
    ...expense,
    items,
    subtotalAmount,
    taxAmount: clampMoney(expense.taxAmount),
    discountAmount: clampMoney(expense.discountAmount),
    serviceAmount: clampMoney(expense.serviceAmount),
    totalAmount: clampMoney(
      subtotalAmount +
        clampMoney(expense.taxAmount) +
        clampMoney(expense.serviceAmount) -
        clampMoney(expense.discountAmount)
    ),
  };
}
