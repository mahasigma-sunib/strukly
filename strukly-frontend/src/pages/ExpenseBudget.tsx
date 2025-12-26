import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import BudgetList from "../components/card/BudgetListCard";
import OverviewChart from "../components/graph/Chart";
import useExpense from "../store/ExpenseStore";
import type BudgetType from "../type/BudgetType";
import Card from "../components/card/Card";
import Button from "../components/button/Button";
import Popup from "../components/popup/PopUp";

export default function ExpenseBudget() {
  const { data, error, isLoading, mutate } = useSWR<BudgetType>(
    `${import.meta.env.VITE_API_BASE_URL}/budget`,
    (url: string) =>
      fetch(url, {
        credentials: "include",
      }).then((res) => res.json())
  );

  const { items: Expenses } = useExpense();

  const [editedBudget, setEditedBudget] = useState<number | string>(0);
  const [editPopUp, setEditPopUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      setEditedBudget(data.budget);
    }
  }, [data]);

  const handleEditBudget = async () => {
    setIsSubmitting(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/budget`,
        {
          budget: Number(editedBudget) || 0,
        },
        {
          withCredentials: true,
        }
      );
      await mutate();
      setEditPopUp(false);
    } catch (error) {
      console.error("Failed to edit Budget:", error);
      alert("Failed to update budget. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditPopup = () => {
    if (!data) return;
    setEditedBudget(data.budget);
    setEditPopUp(true);
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

  const formatMoney = (n: number) =>
    `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
      Math.round(n || 0)
    )}`;

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

  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0);

  const categoriesSet = new Set(budgets.map((b) => b.category.toLowerCase()));
  const totalSpent = Expenses.filter((t) =>
    categoriesSet.has(String(t.category || "").toLowerCase())
  ).reduce(
    (s, t) =>
      s +
      (typeof t.totalAmount === "number"
        ? t.totalAmount
        : Number(t.totalAmount) || 0),
    0
  );

  const remaining = totalBudget - totalSpent;
  const remainingNegative = remaining < 0;

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-[var(--fun-color-text-secondary)]">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error loading budget data
      </div>
    );

  return (
    <div className="min-h-screen pb-20 overflow-y-auto">
      <div className="m-4 my-7 items-center justify-between">
        <div className="font-bold text-3xl">
          <p>Expense Budget</p>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="ml-5 mb-0 mr-4 flex justify-between items-center">
        <div className="font-bold text-2xl">
          <p>Overview</p>
        </div>
        <Button variant="primary" size="sm" onClick={openEditPopup}>
          Edit Budget
        </Button>
      </div>

      {/* Overview Chart */}
      <Card size="md">
        <div className="flex flex-col items-center gap-0.5 p-2">
          <div>
            <OverviewChart
              totalSpent={totalSpent}
              totalBudget={totalBudget}
              size={170}
            />
          </div>
          <div className="w-full max-w-xs text-sm">
            <div className="flex justify-between">
              <div className="text-[var(--fun-color-text-primary)]">Used</div>
              <div className="font-semibold">{formatMoney(totalSpent)}</div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-[var(--fun-color-text-primary)]">
                Remaining
              </div>
              <div
                className={`font-semibold ${
                  remainingNegative ? "text-red-400" : ""
                }`}
              >
                {remainingNegative ? "-" : ""}
                {formatMoney(Math.abs(remaining))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* edit budget popup */}
      <Popup visible={editPopUp} onClose={() => setEditPopUp(false)}>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900">Edit Budget</h3>

          <div className="mt-4 mb-6">
            <input
              type="number"
              aria-label="Budget-Amount"
              className="w-full rounded border px-3 py-2"
              value={editedBudget}
              min={0}
              onChange={(e) => {
                const val = e.target.value;
                setEditedBudget(val === "" ? "" : Number(val));
              }}
            />
          </div>

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setEditPopUp(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleEditBudget}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Popup>

      {/* Expense budget List */}
      <div className="ml-5 mr-4 mt-5 mb-0 flex items-center justify-between">
        <div className="font-bold text-xl">
          <p>My Budgets</p>
        </div>
      </div>

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
