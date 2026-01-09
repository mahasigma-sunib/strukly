// import { ExpenseType } from "../type/ExpenseType";
import useExpense from "../store/ExpenseStore";
import { CategoryKeys } from "../utils/CategoryConfig";


export function useExpenseCalc(totalBudget: number) {
  const { items: Expenses } = useExpense();
  const totalSpent = Expenses.reduce(
    (s, t) =>
      s +
      (typeof t.totalAmount === "number"
        ? t.totalAmount
        : Number(t.totalAmount) || 0),
    0
  );

  const remaining = totalBudget - totalSpent;

  const getSpentForCategory = (category: string) => {
    return Expenses.filter(
      (t) =>
        String(t.category || "").toLowerCase() ===
        String(category || "").toLowerCase()
    ).reduce(
      (acc, t) =>
        acc +
        (typeof t.totalAmount === "number"
          ? t.totalAmount
          : Number(t.totalAmount) || 0),
      0
    );
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
    getSpentForCategory,
    maxCategory,
  };
}
