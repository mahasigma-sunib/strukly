import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import type { ExpenseType } from "../type/ExpenseType";
import Card from "../components/card/Card";
import BackIcon from "../components/utilityIcons/BackIcon";
import EditIcon from "../components/utilityIcons/EditIcon";
import DeleteIcon from "../components/utilityIcons/DeleteIcon";
import Popup from "../components/popup/PopUp";
import Button from "../components/button/Button";
import { getCategoryData } from "../utils/CategoryConfig";
import { deleteExpense } from "../store/ExpenseStore";
import { useState } from "react";

function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useSWR(
    `http://localhost:3000/api/expenses/${id}`,
    (url) => fetch(url, { credentials: "include" }).then((res) => res.json())
  );

  const [deletePopUp, setDeletePopUp] = useState(false);
  const handleDelete = () => {
    deleteExpense(raw.id);
    navigate(-1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "Rp ");
  };

  const formatCardDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
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
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error loading expense
      </div>
    );
  if (!data?.expense)
    return (
      <div className="flex h-screen items-center justify-center text-[var(--fun-color-text-secondary)]">
        No expense found
      </div>
    );

  const raw = data.expense;
  const expense: ExpenseType = {
    userID: raw.userID,
    id: raw.id,
    dateTime: new Date(raw.dateTime),
    vendorName: raw.vendorName,
    category: raw.category,
    currency: "Rp ",
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
    <div className="bg-[var(--fun-color-background)] min-h-screen pb-10 font-sans">
      {/* --- HEADER --- */}
      <div className="bg-[var(--fun-color-surface)] px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-[var(--fun-color-border)]">
        <div className="flex items-center gap-5">
          <div
            onClick={() => navigate(-1)}
            className="cursor-pointer active:opacity-70 transition-opacity -ml-2"
          >
            <BackIcon width={32} height={32} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            onClick={() => console.log("Edit")}
            className="cursor-pointer active:opacity-70 transition-opacity text-[var(--fun-color-text-secondary)]"
          >
            <EditIcon width={32} height={32} />
          </div>
          <div
            onClick={() => setDeletePopUp(true)}
            className="cursor-pointer active:opacity-70 transition-opacity text-red-500"
          >
            <DeleteIcon width={32} height={32} />
          </div>
        </div>
      </div>

      <Popup visible={deletePopUp} onClose={() => setDeletePopUp(false)}>
        <div className="p-6 text-center">
          <div className="mb-2  flex items-center justify-center text-red-500">
            <DeleteIcon width={40} height={40} />
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            Delete Transaction?
          </h3>
          <div className="mt-2 mb-6">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="md"
              onClick={() => setDeletePopUp(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleDelete();
                setDeletePopUp(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Popup>

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
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-800 text-[15px] leading-snug max-w-[70%]">
                      {item.name}
                    </span>
                    <span className="font-bold text-gray-900 text-[15px]">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                  {/* Row 2: Price per unit & Qty */}
                  <div className="flex items-center text-sm text-gray-400 gap-2">
                    <span className="">{item.quantity}</span>
                    <span className="">×</span>
                    <span className="min-w-[80px]">
                      {formatCurrency(item.singleItemPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full border-t border-dashed border-gray-200 mb-6"></div>

            {/* 3. Calculations */}
            <div className="space-y-3 text-[15px]">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(expense.subtotalAmount)}
                </span>
              </div>

              {expense.taxAmount > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(expense.taxAmount)}
                  </span>
                </div>
              )}

              {expense.serviceAmount > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Service</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(expense.serviceAmount)}
                  </span>
                </div>
              )}

              <div
                className={`flex justify-between ${
                  expense.discountAmount > 0
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span>Discount</span>
                <span className="font-medium">
                  {expense.discountAmount > 0 ? "- " : ""}
                  {formatCurrency(expense.discountAmount)}
                </span>
              </div>
            </div>

            <div className="w-full border-t border-gray-200 my-6"></div>

            {/* 4. Grand Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-600 text-lg">Total</span>
              <span className="font-bold text-gray-900 text-lg">
                {formatCurrency(expense.totalAmount)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ExpenseDetail;
