import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import { useTranslation } from "react-i18next";

import ExpenseForm from "./ExpenseForm";

import Button from "../components/button/Button";
import BackIcon from "../components/utilityIcons/BackIcon";

import { toast } from "sonner";
import type { ExpenseType } from "../type/ExpenseType";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import useExpense from "../store/ExpenseStore";
import { mapExpense } from "../hooks/useLoadExpense";
import {
  formatTime,
  getExpenseFormErrors,
  type ExpenseFormErrors,
} from "../schema/ExpenseSchemas";
import { clampExpenseMoneyFields } from "../schema/money";

function createEmptyExpense(): Omit<ExpenseType, "userID"> {
  return {
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
}

function mapExpenseToPostPayload(expense: any) {
  const currency = expense.currency || "IDR";

  return {
    vendorName: expense.vendorName.trim(),
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
      name: item.name.trim(),
      quantity: item.quantity,
      singlePrice: {
        amount: item.singleItemPrice,
        currency,
      },
    })),
  };
}

export default function AddExpense() {
  const { t } = useTranslation();
  const [expense, setExpense] = useState(() => createEmptyExpense());
  const [timeText, setTimeText] = useState(() =>
    formatTime(expense.dateTime.getHours(), expense.dateTime.getMinutes())
  );
  const [formErrors, setFormErrors] = useState<ExpenseFormErrors>({});

  const navigate = useNavigate();
  const location = useLocation();
  const scannedData = location.state?.scannedData;

  useEffect(() => {
    if (scannedData) {
      // Transform backend response to frontend format
      const utcDate = new Date(scannedData.dateTime);

      // The backend treated our picture as UTC and responds with Date in UTC
      // Treat the UTC date/time components as local (no wall-clock shift)
      const localDateTime = new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes(),
        utcDate.getUTCSeconds(),
        utcDate.getUTCMilliseconds()
      );

      const transformedExpense: Omit<ExpenseType, "userID"> = {
        id: "",
        dateTime: localDateTime,
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
      setExpense(clampExpenseMoneyFields(transformedExpense));
      setTimeText(
        formatTime(localDateTime.getHours(), localDateTime.getMinutes())
      );
    }
  }, [scannedData]);

  const { addExpense } = useExpense();
  const handleSubmit = async () => {
    const errors = getExpenseFormErrors(expense, timeText);
    if (errors.vendorName || errors.items || errors.amount || errors.time) {
      setFormErrors(errors);
      return;
    }

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
      toast.error(getApiErrorMessage(err, t("expense.addFailed")));
    }
  };

  return (
    <div className="pb-16 min-h-screen bg-background">
      <div className="bg-surface px-4 py-5 flex items-center gap-3 sticky top-0 z-10 shadow-sm border-b-2 border-border">
        <button onClick={() => navigate(-1)}>
          <BackIcon width={28} height={28} />
        </button>
        <h1 className="text-xl font-semibold">{t("expense.add")}</h1>
      </div>

      <div>
        <ExpenseForm
          expense={expense}
          setExpense={setExpense}
          timeText={timeText}
          onTimeTextChange={setTimeText}
          formErrors={formErrors}
          onClearFormError={(field) =>
            setFormErrors((prev) => ({ ...prev, [field]: undefined }))
          }
        />
        <div className="flex justify-center px-6">
          <Button
            variant="primary"
            size="md"
            className="!w-screen"
            onClick={handleSubmit}
          >
            {t("expense.add")}
          </Button>
        </div>
      </div>
    </div>
  );
}
