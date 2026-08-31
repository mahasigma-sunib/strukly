import useExpense from "../store/ExpenseStore";
import { CategoryKeys } from "../utils/CategoryConfig";
import { calculateBudgetStatus } from "./budgetStatus";

function toAmount(value: unknown): number {
  return typeof value === "number" ? value : Number(value) || 0;
}

export { calculateBudgetStatus };

export function useExpenseCalc(totalBudget: number) {
  const { items: Expenses } = useExpense();
  const totalSpent = Expenses.reduce((s, t) => s + toAmount(t.totalAmount), 0);

  const { remaining, overBy, isOverBudget } = calculateBudgetStatus(
    totalBudget,
    totalSpent,
  );

  const getSpentForCategory = (category: string) => {
    return Expenses.filter(
      (t) =>
        String(t.category || "").toLowerCase() ===
        String(category || "").toLowerCase(),
    ).reduce((acc, t) => acc + toAmount(t.totalAmount), 0);
  };

  const maxCategory = CategoryKeys.map((category) => ({
    category,
    spent: getSpentForCategory(category),
  })).reduce((max, curr) => (curr.spent > max.spent ? curr : max), {
    category: "",
    spent: 0,
  });

  return {
    totalSpent,
    remaining,
    overBy,
    isOverBudget,
    getSpentForCategory,
    maxCategory,
  };
}
