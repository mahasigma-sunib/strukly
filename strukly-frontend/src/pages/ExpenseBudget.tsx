import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";

import BudgetListCard from "../components/card/BudgetListCard";
import OverviewChart from "../components/graph/Chart";
import Card from "../components/card/Card";
import Button from "../components/button/Button";
import Popup from "../components/popup/PopUp";
import HappyMascot from "../components/mascots/HappyMascot";

import useExpense from "../store/ExpenseStore";
import { useLoadExpense } from "../hooks/useLoadExpense";
import type BudgetType from "../type/BudgetType";
import { CategoryKeys } from "../utils/CategoryConfig";

export default function ExpenseBudget() {
  const { data, error, isLoading, mutate } = useSWR<BudgetType>(
    `${import.meta.env.VITE_API_BASE_URL}/budget`,
    (url: string) =>
      fetch(url, {
        credentials: "include",
      }).then((res) => res.json())
  );

  const { items: Expenses } = useExpense();

  const [editedBudget, setEditedBudget] = useState<number>(0);
  const [editPopUp, setEditPopUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  useLoadExpense(today.getMonth() + 1, today.getFullYear(), true);
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

  const formatIDR = (value: number) =>
    value ? value.toLocaleString("id-ID") : "";

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

  const totalBudget = data?.budget ? data.budget : 0;

  const totalSpent = Expenses.reduce(
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
    <div className="min-h-screen pb-20 ">
      <div className="p-5 flex items-center mb-4 justify-between bg-surface border-b-3 border-border rounded-b-2xl sticky top-0 z-20 w-full">
        <div className="font-bold text-3xl">
          <p>Budget</p>
        </div>
        <div>
          <Button
            onClick={openEditPopup}
            variant="primary"
            size="md"
            className="
              !rounded-full 
              !font-bold 
              active:translate-y-[4px]
              !transition-all
              flex flex-row gap-1
              text-lg
              justify-center
              items-center
              !py-2
              !px-3
            "
          >
            Edit Budget
          </Button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="absolute top-18 right-10">
        <div className="overflow-hidden">
          <div className="transform translate-y-1/3">
            <HappyMascot width={80} height={80} />
          </div>
        </div>
      </div>
      <div className="ml-5 mb-0 mr-4 flex justify-between items-center">
        <div className="font-bold text-2xl">
          <p>Overview</p>
        </div>
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
          <div className="flex flex-row justify-between w-full max-w-xs text-sm">
            <div className="flex flex-col justify-start items-start flex-1 pr-4">
              <div className="text-text-secondary">Used</div>
              <div className="font-bold text-lg text-text-secondary">
                {formatIDR(totalSpent)}
              </div>
            </div>
            <div className="flex flex-col justify-start items-start flex-1 border-l-2 border-gray-300 pl-4">
              <div className="text-text-secondary">Remaining</div>
              <div
                className={`font-bold text-lg  ${
                  remainingNegative ? "text-red-500" : "text-text-secondary"
                }`}
              >
                {remainingNegative ? "-" : ""}
                {formatIDR(Math.abs(remaining))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* edit budget popup */}
      <Popup visible={editPopUp} onClose={() => setEditPopUp(false)}>
        <div className="p-6 w-full max-w-sm mx-auto">
          {/* Title */}
          <h3 className="text-xl font-bold text-text-primary mb-1">
            Edit Budget
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            Set your total monthly budget
          </p>

          {/* Input */}
          <div className="relative mb-6">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              aria-label="Budget-Amount"
              className="
                w-full pl-10 pr-4 py-3
                rounded-xl
                border border-border
                text-lg font-bold
                text-right
                outline-none
                focus:ring-2 focus:ring-primary
                transition
              "
              placeholder="0"
              value={formatIDR(editedBudget)}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/[^\d]/g, "");
                setEditedBudget(digitsOnly === "" ? 0 : Number(digitsOnly));
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setEditPopUp(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleEditBudget}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Popup>

      {/* Expense budget List */}
      <div className="ml-5 mr-4 mt-6 mb-0 flex items-center justify-between">
        <div className="font-bold text-2xl">
          <p>Top Categories</p>
        </div>
      </div>

      <div className="space-y-2">
        {CategoryKeys.map((b) => ({ b, spent: getSpentForCategory(b) }))
          .filter(({ spent }) => spent > 1)
          .sort((a, b) => b.spent - a.spent)
          .map(({ b, spent }) => (
            <Card>
              <div key={b} className="py-2">
                <BudgetListCard
                  currency="Rp"
                  spent={spent}
                  usedBudget={totalSpent}
                  category={b}
                />
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
