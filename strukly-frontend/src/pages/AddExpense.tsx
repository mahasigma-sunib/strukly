import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import ExpenseForm from "./ExpenseForm";

import Button from "../components/button/Button";
import BackIcon from "../components/utilityIcons/BackIcon";

import type { ExpenseType } from "../type/ExpenseType";

const emptyExpense: Omit<ExpenseType, "userID"> = {
  id: "",
  dateTime: new Date(),
  vendorName: "",
  category: "food",

  currency: "IDR",
  subtotalAmount: 0,
  taxAmount: 0,
  discountAmount: 0,
  serviceAmount: 0,
  totalAmount: 0,

  items: [],
};

function mapExpenseToPostPayload(expense: any) {
  const currency = expense.currency || "IDR";

  return {
    vendorName: expense.vendorName,
    category: expense.category,
    dateTime: expense.dateTime.toISOString(),

    subtotalAmount: {
      amount: expense.subtotalAmount,
      currency,
    },
    taxAmount: {
      amount: expense.taxAmount,
      currency,
    },
    discountAmount: {
      amount: expense.discountAmount,
      currency,
    },
    serviceAmount: {
      amount: expense.serviceAmount,
      currency,
    },

    items: expense.items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      singlePrice: {
        amount: item.singleItemPrice,
        currency,
      },
    })),
  };
}

export default function AddExpense() {
  const [expense, setExpense] =
    useState<Omit<ExpenseType, "userID">>(emptyExpense);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const payload = mapExpenseToPostPayload(expense);
      console.log("POST payload:", payload);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/expenses`,
        payload,
        {
          withCredentials: true,
        }
      );
      navigate("../expense");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-26 min-h-screen bg-[var(--fun-color-background)]">
      <div className="bg-[var(--fun-color-surface)] px-6 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm border-b border-[var(--fun-color-border)]">
        <button onClick={() => navigate(-1)}>
          <BackIcon width={28} height={28} />
        </button>
        <h1 className="text-xl font-semibold">Add Expense</h1>
      </div>

      <div>
        <ExpenseForm expense={expense} setExpense={setExpense} />
        <div className="flex justify-center " >
          <Button onClick={handleSubmit}>Add Expense</Button>
        </div>
      </div>
    </div>
  );
}
