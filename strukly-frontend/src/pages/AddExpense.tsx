import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import ExpenseForm from "./ExpenseForm";

import Button from "../components/button/Button";
import BackIcon from "../components/utilityIcons/BackIcon";

import type { ExpenseType } from "../type/ExpenseType";
import useExpense from "../store/ExpenseStore";
import { mapExpense } from "../hooks/useLoadExpense";

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
  const location = useLocation();
  const scannedData = location.state?.scannedData;

  useEffect(() => {
    if (scannedData) {
      // Transform backend response to frontend format
      const transformedExpense: Omit<ExpenseType, "userID"> = {
        id: "",
        dateTime: new Date(scannedData.dateTime),
        vendorName: scannedData.vendorName || "",
        category: scannedData.category || "food",
        currency: scannedData.subtotalAmount?.currency || "IDR",
        subtotalAmount: scannedData.subtotalAmount?.amount || 0,
        taxAmount: scannedData.taxAmount?.amount || 0,
        discountAmount: scannedData.discountAmount?.amount || 0,
        serviceAmount: scannedData.serviceAmount?.amount || 0,
        totalAmount:
          (scannedData.subtotalAmount?.amount || 0) +
          (scannedData.taxAmount?.amount || 0) +
          (scannedData.serviceAmount?.amount || 0) -
          (scannedData.discountAmount?.amount || 0),
        items: (scannedData.items || []).map(
          (
            item: {
              name?: string;
              quantity?: number;
              singlePrice?: { amount?: number; currency?: string };
            },
            index: number
          ) => ({
            expenseID: "",
            id: Date.now().toString() + index,
            name: item.name || "",
            quantity: item.quantity || 1,
            singleItemPrice: item.singlePrice?.amount || 0,
            totalPrice: (item.singlePrice?.amount || 0) * (item.quantity || 1),
          })
        ),
      };
      setExpense(transformedExpense);
    }
  }, [scannedData]);

  const { addExpense } = useExpense();
  const handleSubmit = async () => {
    try {
      const payload = mapExpenseToPostPayload(expense);
      // console.log("POST payload:", payload);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/expenses`,
        payload,
        {
          withCredentials: true,
        }
      );
      addExpense(mapExpense(res.data.expense));
      navigate("/expense");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-16 min-h-screen bg-background">
      <div className="bg-surface px-4 py-5 flex items-center gap-3 sticky top-0 z-10 shadow-sm border-b-2 border-border">
        <button onClick={() => navigate(-1)}>
          <BackIcon width={28} height={28} />
        </button>
        <h1 className="text-xl font-semibold">Add Expense</h1>
      </div>

      <div>
        <ExpenseForm expense={expense} setExpense={setExpense} />
        <div className="flex justify-center px-6">
          <Button
            variant="primary"
            size="md"
            className="!w-screen"
            onClick={handleSubmit}
          >
            Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
}
