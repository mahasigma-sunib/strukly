export function calculateBudgetStatus(totalBudget: number, totalSpent: number) {
  const remaining = totalBudget - totalSpent;
  const overBy = Math.max(0, totalSpent - totalBudget);
  const isOverBudget = remaining < 0;

  return {
    remaining,
    overBy,
    isOverBudget,
  };
}
