// import { useState } from "react";
import BudgetList from "../components/card/BudgetListCard";
import OverviewChart from "../components/graph/Chart";
import useExpense from "../store/ExpenseStore";
import Card from "../components/card/Card";
import Button from "../components/button/Button";
// import Popup from "../components/popup/PopUp";


export default function ExpenseBudget() {
  const { items: Expenses } = useExpense();

  const getSpentForCategory = (category: string) => {
    return Expenses
      .filter((t) => String(t.category || "").toLowerCase() === String(category || "").toLowerCase())
      .reduce((acc, t) => acc + (typeof t.totalAmount === "number" ? t.totalAmount : Number(t.totalAmount) || 0), 0);
  };

  const budgets = [
    { category: "Food", budget: 3000000 },
    { category: "Groceries", budget: 2000000 },
    { category: "Transportation", budget: 1200000 },
    { category: "Utilities", budget: 2500000 },
    { category: "Shopping", budget: 1500000 },
    { category: "Entertainment", budget: 1000000 },
    { category: "Others", budget: 800000 },
  ] as const;

  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0);

  const categoriesSet = new Set(budgets.map((b) => b.category.toLowerCase()));
  const totalSpent = Expenses
    .filter((t) => categoriesSet.has(String(t.category || "").toLowerCase()))
    .reduce((s, t) => s + (typeof t.totalAmount === "number" ? t.totalAmount : Number(t.totalAmount) || 0), 0);

  const formatMoney = (n: number) => `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Math.round(n || 0))}`;
  const remaining = totalBudget - totalSpent;
  const remainingNegative = remaining < 0;

  return (
    <div className="min-h-screen pb-20 overflow-y-auto">
      <div className="m-4 my-7 items-center justify-between">
        {/* Page title */}
        <div className="font-bold text-3xl">
          <p>Expense Budget</p>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="ml-5 mb-0 mr-4 flex flex-col">
        {/* Section Title */}
        <div className="font-bold text-xl">
          <p>Overview</p>
        </div>
      </div>

      {/* Overview Chart */}
      <Card size="md">
        <div className="flex flex-col items-center gap-0.5 p-2">
          <div>
            <OverviewChart totalSpent={totalSpent} totalBudget={totalBudget} size={170} />
          </div>
          <div className="w-full max-w-xs text-sm">
            <div className="flex justify-between">
              <div className="text-[fun-color-text-primary]">Used</div>
              <div className="font-semibold">{formatMoney(totalSpent)}</div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-[fun-color-text-primary]">Remaining</div>
              <div className={`font-semibold ${remainingNegative ? "text-red-400" : ""}`}>
                {remainingNegative ? "-" : ""}{formatMoney(Math.abs(remaining))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Expense budget */}
      <div className="ml-5 mr-4 mt-5 mb-0 flex items-center justify-between">
        {/* Section Title */}
        <div className="font-bold text-xl">
          <p>My Budgets</p>
        </div>
        {/* Edit Budget Button */}
        <div className="">
          <Button 
            variant="primary"
            size="sm"
          >
            Edit Budget
          </Button>
        </div>
      </div>
      {/* Budget List */}
      <Card size="md">
        <div className="space-y-2">
          {budgets.map((b) => {
            const spent = getSpentForCategory(b.category);
            return (
              <div key={b.category} className="py-2">
                <BudgetList
                  currency="Rp"
                  spent={spent}
                  budget={b.budget}
                  category={b.category}
                />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}