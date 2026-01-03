import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ExpenseForm from "./ExpenseForm";
import BackIcon from "../components/utilityIcons/BackIcon";

import type { ExpenseType } from "../type/ExpenseType";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedExpense = location.state?.expense as ExpenseType | undefined;

  if (!passedExpense) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">No expense data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const [expense, setExpense] = useState<ExpenseType>(passedExpense);

  const handleSubmit = async () => {
    if (!expense || !id) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/${expense.id}`,
        {
          vendorName: expense.vendorName,
          category: expense.category,
          dateTime: expense.dateTime.toISOString(),

          subtotalAmount: {
            amount: expense.subtotalAmount,
            currency: expense.currency,
          },
          taxAmount: {
            amount: expense.taxAmount,
            currency: expense.currency,
          },
          discountAmount: {
            amount: expense.discountAmount,
            currency: expense.currency,
          },
          serviceAmount: {
            amount: expense.serviceAmount,
            currency: expense.currency,
          },

          items: expense.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            singlePrice: {
              amount: item.singleItemPrice,
              currency: expense.currency,
            },
          })),
        },
        { withCredentials: true }
      );

      navigate(-1);
    } catch (err) {
      console.error("Failed to update expense", err);
    }
  };

  return (
    <div className="pb-16 min-h-screen bg-[var(--fun-color-background)]">
      {/* Header */}
      <div className="bg-[var(--fun-color-surface)] px-4 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-[var(--fun-color-border)]">
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate(-1)}>
            <BackIcon width={28} height={28} />
          </button>
          <h1 className="text-xl font-semibold">Edit Expense</h1>
        </div>

        <button
          onClick={handleSubmit}
          className="cursor-pointer active:opacity-70 transition-opacity text-blue-500 font-bold text-xl mr-2 "
        >
          Done
        </button>
      </div>

      {/* Form */}
      <ExpenseForm expense={expense} setExpense={setExpense} />
    </div>
  );
}
