import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { fetcher } from "../utils/fetcher";

import type { ExpenseType } from "../type/ExpenseType";
import { getCategoryData } from "../utils/CategoryConfig";

import Card from "../components/card/Card";
import BackIcon from "../components/utilityIcons/BackIcon";
import EditIcon from "../components/utilityIcons/EditIcon";
import DeleteIcon from "../components/utilityIcons/DeleteIcon";
import Popup from "../components/popup/PopUp";
import Button from "../components/button/Button";
import SplitBillModal from "../components/modal/SplitBillModal";
import LoadErrorPlaceholder from "../components/placeholder/LoadErrorPlaceholder";
import TrashMascot from "../components/mascots/TrashMascot";
import Money from "../components/money/Money";
import { formatIDRDisplay } from "../components/money/formatIDRDisplay";
import useExpense from "../store/ExpenseStore";

function ExpenseDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading, mutate } = useSWR(
    `${import.meta.env.VITE_API_BASE_URL}/expenses/${id}`,
    fetcher
  );

  const [deletePopUp, setDeletePopUp] = useState(false);
  const [splitPopUp, setSplitPopUp] = useState(false);
  const { deleteExpense } = useExpense();
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/${raw.id}`,
        {
          withCredentials: true,
        }
      );
      deleteExpense(raw.id);
      navigate(-1);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("expense.deleteFailed")));
      throw error; // rethrow so caller keeps the popup open on failure
    }
  };

  const amountText = (
    value: number,
    className = "",
    decimalClassName = "opacity-70"
  ) => (
    <div
      className={`min-w-0 flex justify-end ${className}`}
      title={formatIDRDisplay(value)}
    >
      <Money
        amount={value}
        currency="IDR"
        mainClassName="min-w-0 truncate"
        decimalClassName={`min-w-0 truncate ${decimalClassName}`}
      />
    </div>
  );

  const formatCardDate = (date: Date) => {
    const locale = i18n.resolvedLanguage === "id" ? "id-ID" : "en-GB";
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date); // 27 September 2025, 19:40
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-[var(--fun-color-text-secondary)]">
        {t("common.loading")}
      </div>
    );
  if (error)
    return (
      <div className="bg-background min-h-screen pb-10">
        <LoadErrorPlaceholder
          title={t("expense.loadDetailError")}
          onRetry={() => mutate()}
        />
      </div>
    );
  if (!data?.expense)
    return (
      <div className="flex h-screen items-center justify-center text-[var(--fun-color-text-secondary)]">
        {t("expense.notFound")}
      </div>
    );

  const raw = data.expense;
  const expense: ExpenseType = {
    userID: raw.userID,
    id: raw.id,
    dateTime: new Date(raw.dateTime),
    vendorName: raw.vendorName,
    category: raw.category,
    currency: raw.totalAmount.currency,
    subtotalAmount: raw.subtotalAmount.amount,
    taxAmount: raw.taxAmount.amount,
    discountAmount: raw.discountAmount.amount,
    serviceAmount: raw.serviceAmount.amount,
    totalAmount: raw.totalAmount.amount,
    items: raw.items.map((item: any) => ({
      expenseID: id,
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      singleItemPrice: item.singlePrice.amount,
      totalPrice: item.totalPrice.amount,
    })),
  };

  // Get dynamic icon and color
  const { icon } = getCategoryData(expense.category);

  return (
    <div className="bg-background min-h-screen pb-10">
      {/* --- HEADER --- */}
      <div className="bg-surface px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-[var(--fun-color-border)]">
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate(-1)}
            className="cursor-pointer active:opacity-70 transition-opacity -ml-2"
          >
            <BackIcon width={28} height={28} />
          </div>
          <p className="font-semibold text-xl">{t("expense.detail")}</p>
        </div>

        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate(`/expense/${id}`, { state: { expense } })}
            className="cursor-pointer p-1 active:bg-gray-100 rounded-xl transition-opacity text-sky-500"
          >
            <EditIcon width={32} height={32} />
          </div>
          <div
            onClick={() => setDeletePopUp(true)}
            className="cursor-pointer p-1 active:bg-gray-100 rounded-xl transition-opacity text-red-500"
          >
            <DeleteIcon width={32} height={32} />
          </div>
        </div>
      </div>

      <Popup visible={deletePopUp} onClose={() => setDeletePopUp(false)}>
        <div className="p-4 text-center">
          <div className="mb-6 flex items-center justify-center text-red-500">
            <TrashMascot width={120} height={100} />
          </div>

          <h3 className="text-xl font-bold text-gray-900">
            {t("expense.deleteTitle")}
          </h3>
          <div className="mt-2 mb-6">
            <p className="text-base text-gray-500">
              {t("expense.deleteBody")}
            </p>
          </div>

          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setDeletePopUp(false)}
              className="w-full"
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={async () => {
                try {
                  await handleDelete();
                  setDeletePopUp(false);
                } catch {
                  // toast already shown in handleDelete; keep popup open
                }
              }}
              className="w-full !bg-[#fa1e1e] !shadow-[0_4px_0_0_#de0d0d]"
            >
              {t("common.delete")}
            </Button>
          </div>
        </div>
      </Popup>

      <SplitBillModal
        visible={splitPopUp}
        onClose={() => setSplitPopUp(false)}
        totalAmount={expense.totalAmount}
        vendorName={expense.vendorName}
      />

      {/* main content*/}
      <div className="p-3 mt-1 flex justify-center">
        <Card className="w-full max-w-md !p-0 !rounded-2xl !overflow-hidden shadow-sm border-none">
          <div className="p-6 bg-[var(--fun-color-surface)]">
            {/* icon & title */}
            <div className="flex flex-col items-center mb-6">
              <div className="mb-4">{icon}</div>
              <h2 className="text-xl font-bold text-gray-900">
                {expense.vendorName}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {formatCardDate(expense.dateTime)}
              </p>
            </div>

            <div className="w-full border-t border-dashed border-gray-200 mb-6"></div>

            {/* 2. Items List */}
            <div className="space-y-5 mb-4">
              {expense.items.map((item) => (
                <div key={item.id} className="flex flex-col">
                  {/* Row 1: Name & Total */}
                  <div className="flex justify-between items-start gap-3 mb-1 min-w-0">
                    <span className="font-semibold text-gray-800 text-base leading-snug min-w-0 truncate max-w-[70%]">
                      {item.name}
                    </span>
                    {amountText(
                      item.totalPrice,
                      "font-bold text-gray-900 text-base",
                      "text-sm font-bold opacity-70"
                    )}
                  </div>
                  {/* Row 2: Price per unit & Qty */}
                  <div className="flex items-center text-sm text-gray-400 gap-2">
                    <span className="">{item.quantity}</span>
                    <span className="">×</span>
                    <div className="min-w-[80px]">
                      <Money
                        amount={item.singleItemPrice}
                        currency="IDR"
                        decimalClassName="opacity-70"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full border-t border-dashed border-gray-200 mb-6"></div>

            {/* 3. Calculations */}
            <div className="space-y-3 text-base">
              <div className="flex justify-between gap-3 min-w-0 text-gray-500">
                <span className="shrink-0">{t("expense.subtotal")}</span>
                {amountText(
                  expense.subtotalAmount,
                  "font-medium text-gray-900"
                )}
              </div>

              {expense.taxAmount > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>{t("expense.tax")}</span>
                  {amountText(expense.taxAmount, "font-medium text-gray-900")}
                </div>
              )}

              {expense.serviceAmount > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>{t("expense.service")}</span>
                  {amountText(
                    expense.serviceAmount,
                    "font-medium text-gray-900"
                  )}
                </div>
              )}

              <div
                className={`flex justify-between ${
                  expense.discountAmount > 0
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span>{t("expense.discount")}</span>
                <div className="flex items-baseline font-medium">
                  {expense.discountAmount > 0 && <span>-</span>}
                  <Money
                    amount={expense.discountAmount}
                    currency="IDR"
                    decimalClassName="opacity-70"
                  />
                </div>
              </div>
            </div>

            <div className="w-full border-t border-gray-200 my-6"></div>

            {/* 4. Grand Total */}
            <div className="flex justify-between items-center gap-3 min-w-0 mb-6">
              <span className="font-bold text-gray-500 text-xl shrink-0">
                {t("expense.total")}
              </span>
              {amountText(
                expense.totalAmount,
                "font-bold text-gray-700 text-xl",
                "text-base font-bold opacity-70"
              )}
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => setSplitPopUp(true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Users size={18} />
              {t("splitBill.title")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ExpenseDetail;
