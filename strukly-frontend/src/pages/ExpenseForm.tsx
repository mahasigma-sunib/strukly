import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { ExpenseType } from "../type/ExpenseType";
import type { ExpenseItemType } from "../type/ExpenseItemType";
import { getCategoryData, categoryColors } from "../utils/CategoryConfig";

import Card from "../components/card/Card";
import Dropdown from "../components/dropdown/Dropdown";
import Toggle from "../components/button/ToggleButton";
import DropDownIcon from "../components/utilityIcons/DropdownIcon";
import ErrorMessage from "../components/ErrorMessage";
import Money from "../components/money/Money";
import { formatIDRDisplay } from "../components/money/formatIDRDisplay";
import {
  TIME_INVALID,
  formatTime,
  parseTimeInput,
  type ExpenseFormErrors,
} from "../schema/ExpenseSchemas";
import {
  MAX_ITEM_QUANTITY,
  MAX_MONEY_AMOUNT,
  MONEY_AMOUNT_MAX_DISPLAY,
  MONEY_AMOUNT_TOO_LARGE,
  clampItemAmounts,
  clampMoney,
  parseDigitAmount,
} from "../schema/money";

// interface Props {
//   expense: Omit<ExpenseType, "userID">;
//   setExpense: React.Dispatch<React.SetStateAction<Omit<ExpenseType, "userID">>>;
// }

interface Props<T extends Omit<ExpenseType, "userID"> | ExpenseType> {
  expense: T;
  setExpense: React.Dispatch<React.SetStateAction<T>>;
  timeText: string;
  onTimeTextChange: (text: string) => void;
  formErrors?: ExpenseFormErrors;
  onClearFormError?: (field: keyof ExpenseFormErrors) => void;
}

export default function ExpenseForm<
  T extends Omit<ExpenseType, "userID"> | ExpenseType
>({
  expense,
  setExpense,
  timeText,
  onTimeTextChange,
  formErrors,
  onClearFormError,
}: Props<T>) {
  const { t } = useTranslation();
  // const [isDetailed, setIsDetailed] = useState(expense.items.length > 0);
  const [isDetailed, setIsDetailed] = useState(true);
  const [timeError, setTimeError] = useState<string | undefined>();

  const { icon } = getCategoryData(expense.category);

  const handleToggleDetailed = (enabled: boolean) => {
    if (enabled && expense.items.length === 0) addItem();
    setIsDetailed(enabled);
  };

  const addItem = useCallback(() => {
    const newItem: ExpenseItemType = {
      expenseID: expense.id,
      id: crypto.randomUUID(),
      name: "",
      quantity: 1,
      singleItemPrice: 0,
      totalPrice: 0,
    };
    // Use functional update to avoid needing 'expense' in the dependency array
    setExpense((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  }, [expense.id, setExpense]);

  const updateItem = (
    index: number,
    field: keyof ExpenseItemType,
    value: any
  ) => {
    const newItems = [...expense.items];
    const targetItem = { ...newItems[index], [field]: value };

    if (field === "singleItemPrice" || field === "quantity") {
      const nextPrice =
        field === "singleItemPrice"
          ? Number(value)
          : targetItem.singleItemPrice;
      const nextQty =
        field === "quantity" ? Number(value) : targetItem.quantity;
      const clamped = clampItemAmounts(nextPrice, nextQty);
      targetItem.singleItemPrice = clamped.singleItemPrice;
      targetItem.quantity = clamped.quantity;
      targetItem.totalPrice = clamped.totalPrice;
    }

    newItems[index] = targetItem;
    setExpense({ ...expense, items: newItems });
  };

  const removeItem = (index: number) => {
    setExpense({
      ...expense,
      items: expense.items.filter((_, i) => i !== index),
    });
  };

  useEffect(() => {
    if (!isDetailed) return;

    if (isDetailed && expense.items.length === 0) {
      addItem();
    }

    const subtotal = expense.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    const preDiscountTotal =
      subtotal + expense.taxAmount + expense.serviceAmount;
    const discountAmount = Math.min(
      expense.discountAmount,
      Math.max(0, preDiscountTotal)
    );
    const total = preDiscountTotal - discountAmount;

    if (
      subtotal !== expense.subtotalAmount ||
      total !== expense.totalAmount ||
      discountAmount !== expense.discountAmount
    ) {
      setExpense((prev) => ({
        ...prev,
        subtotalAmount: subtotal,
        discountAmount,
        totalAmount: total,
      }));
    }
  }, [
    expense.items,
    expense.taxAmount,
    expense.serviceAmount,
    expense.discountAmount,
    expense.subtotalAmount,
    expense.totalAmount,
    isDetailed,
    addItem,
  ]);

  const options = Object.keys(categoryColors).map((key) => ({
    label: t(`category.${key}`),
    value: key,
  }));

  const validDate =
    expense.dateTime instanceof Date
      ? expense.dateTime
      : new Date(expense.dateTime);

  const formatIDR = (value: number) =>
    value ? value.toLocaleString("id-ID") : "";

  const formatDateInput = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

  const applyTime = (hours: number, minutes: number) => {
    const newDate = new Date(validDate);
    newDate.setHours(hours, minutes);
    setExpense({ ...expense, dateTime: newDate });
  };

  const amountText = (
    value: number,
    className = "",
    decimalClassName = "opacity-70"
  ) => (
    <div
      className={`min-w-0 truncate tabular-nums flex justify-end ${className}`}
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

  const amountTooLarge =
    expense.subtotalAmount +
      expense.taxAmount +
      expense.serviceAmount -
      expense.discountAmount >
    MAX_MONEY_AMOUNT;

  const labelCase = "text-sm font-bold text-gray-400";

  const inputBase =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-blue-500";

  const numberInput =
    "flex-1 min-w-0 max-w-[12rem] text-right border border-gray-300 rounded-lg px-3 py-2 font-bold outline-none overflow-hidden";

  return (
    <div>
      {/* main content */}
      <div className="p-1 m-1 mt-4 flex flex-col gap-2">
        {/* DO NOT TOUCH THIS, it is for the card size consistency */}

        {/* Category */}
        <div className="flex justify-center">
          <Dropdown
            options={options}
            onChange={(opt) =>
              setExpense({ ...expense, category: opt.value as string })
            }
            selected={{
              label: t(`category.${expense.category}`),
              value: expense.category,
            }}
          >
            <Card className="!m-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <div className="text-sm text-gray-400">
                      {t("expenseForm.category")}
                    </div>
                    <div className="text-lg font-semibold">
                      {t(`category.${expense.category}`)}
                    </div>
                  </div>
                </div>
                <DropDownIcon width={24} />
              </div>
            </Card>
          </Dropdown>
        </div>

        {/* Vendor & Date */}
        <Card className="flex flex-col gap-4">
          <div>
            <p className={`${labelCase} mb-2`}>{t("expenseForm.vendorName")}</p>
            <input
              className={`${inputBase} ${
                formErrors?.vendorName ? "border-status-error" : ""
              }`}
              placeholder={t("expenseForm.vendorPlaceholder")}
              value={expense.vendorName}
              onChange={(e) => {
                onClearFormError?.("vendorName");
                setExpense({ ...expense, vendorName: e.target.value });
              }}
            />
            {formErrors?.vendorName && (
              <ErrorMessage>{t(formErrors.vendorName)}</ErrorMessage>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <p className={`${labelCase} mb-2`}>{t("expenseForm.date")}</p>
              <input
                type="date"
                className={inputBase}
                value={formatDateInput(validDate)}
                onChange={(e) => {
                  const [y, m, d] = e.target.value.split("-").map(Number);
                  if (!y || !m || !d) return;
                  const newDate = new Date(validDate);
                  newDate.setFullYear(y, m - 1, d);
                  setExpense({ ...expense, dateTime: newDate });
                }}
              />
            </div>

            <div className="flex-1">
              <p className={`${labelCase} mb-2`}>{t("expenseForm.time")}</p>
              <input
                type="text"
                inputMode="numeric"
                placeholder="HH:mm"
                className={`${inputBase} ${
                  timeError || formErrors?.time ? "border-status-error" : ""
                }`}
                value={timeText}
                onChange={(e) => {
                  onClearFormError?.("time");
                  setTimeError(undefined);
                  onTimeTextChange(e.target.value);
                  const parsed = parseTimeInput(e.target.value);
                  if (parsed) applyTime(parsed.hours, parsed.minutes);
                }}
                onBlur={() => {
                  const parsed = parseTimeInput(timeText);
                  if (!parsed) {
                    setTimeError(TIME_INVALID);
                    return;
                  }
                  setTimeError(undefined);
                  onTimeTextChange(formatTime(parsed.hours, parsed.minutes));
                  applyTime(parsed.hours, parsed.minutes);
                }}
              />
              {(timeError || formErrors?.time) && (
                <ErrorMessage>
                  {t(timeError || formErrors?.time || "")}
                </ErrorMessage>
              )}
            </div>
          </div>
        </Card>

        {/* Toggle */}
        <div className="flex items-center justify-between px-5">
          <span className={`${labelCase}  text-gray-500`}>
            {t("expenseForm.detailedReceipt")}
          </span>
          <Toggle enabled={isDetailed} onChange={handleToggleDetailed} />
        </div>

        {/* Receipt */}
        <Card className="p-6 overflow-hidden">
          {isDetailed ? (
            <div className="flex flex-col gap-6">
              <h3 className={`${labelCase}`}>{t("expenseForm.itemsList")}</h3>

              {expense.items.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      className={`flex-1 border rounded-lg px-4 py-2.5 text-base font-medium ${
                        formErrors?.items && !item.name.trim()
                          ? "border-status-error"
                          : "border-gray-200"
                      }`}
                      placeholder={t("expenseForm.itemName")}
                      value={item.name}
                      onChange={(e) => {
                        onClearFormError?.("items");
                        updateItem(index, "name", e.target.value);
                      }}
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="text-gray-400 text-xl px-1"
                    >
                      &#10005;
                    </button>
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="number"
                      min={0}
                      max={MAX_MONEY_AMOUNT}
                      className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-base font-medium overflow-hidden"
                      placeholder={t("expenseForm.price")}
                      value={item.singleItemPrice || ""}
                      onChange={(e) => {
                        onClearFormError?.("amount");
                        updateItem(index, "singleItemPrice", e.target.value);
                      }}
                    />

                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 shrink-0">
                      <input
                        type="number"
                        min={1}
                        max={MAX_ITEM_QUANTITY}
                        className="w-12 text-center text-base font-medium outline-none"
                        value={item.quantity}
                        onChange={(e) => {
                          onClearFormError?.("amount");
                          updateItem(index, "quantity", e.target.value);
                        }}
                      />
                      <span className="text-sm font-bold text-gray-400 ml-1">
                        &#215;
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 text-right font-bold text-gray-500 mr-2">
                      {amountText(item.totalPrice)}
                    </div>
                  </div>
                </div>
              ))}

              {formErrors?.items && (
                <ErrorMessage>{t(formErrors.items)}</ErrorMessage>
              )}

              <button
                onClick={addItem}
                className="w-full text-base py-3 border border-blue-500 rounded-xl text-blue-500 font-bold"
              >
                &#43; {t("expenseForm.addItem")}
              </button>

              <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between items-center gap-3 min-w-0">
                  <span className="text-sm text-gray-400 shrink-0">
                    {t("expense.subtotal")}
                  </span>
                  {amountText(
                    expense.subtotalAmount,
                    "font-bold mr-2 text-gray-500"
                  )}
                </div>

                <div className="flex justify-between items-center gap-3 min-w-0">
                  <span className="text-sm text-gray-400 shrink-0">
                    {t("expense.tax")}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={MAX_MONEY_AMOUNT}
                    className={numberInput}
                    value={expense.taxAmount || ""}
                    onChange={(e) => {
                      onClearFormError?.("amount");
                      setExpense({
                        ...expense,
                        taxAmount: clampMoney(Number(e.target.value)),
                      });
                    }}
                  />
                </div>

                <div className="flex justify-between items-center gap-3 min-w-0">
                  <span className="text-sm text-gray-400 shrink-0">
                    {t("expense.service")}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={MAX_MONEY_AMOUNT}
                    className={numberInput}
                    value={expense.serviceAmount || ""}
                    onChange={(e) => {
                      onClearFormError?.("amount");
                      setExpense({
                        ...expense,
                        serviceAmount: clampMoney(Number(e.target.value)),
                      });
                    }}
                  />
                </div>

                <div className="flex justify-between items-center gap-3 min-w-0">
                  <span className="text-sm text-gray-400 shrink-0">
                    {t("expense.discount")}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={MAX_MONEY_AMOUNT}
                    className={`${numberInput} text-red-500`}
                    value={expense.discountAmount || ""}
                    onChange={(e) => {
                      onClearFormError?.("amount");
                      const preDiscountTotal =
                        expense.subtotalAmount +
                        expense.taxAmount +
                        expense.serviceAmount;
                      setExpense({
                        ...expense,
                        discountAmount: Math.min(
                          clampMoney(Number(e.target.value)),
                          Math.max(0, preDiscountTotal)
                        ),
                      });
                    }}
                  />
                </div>

                <div className="flex justify-between items-center gap-3 min-w-0 pt-2">
                  <span className="font-bold text-gray-500 shrink-0">
                    {t("expense.total")}
                  </span>
                  {amountText(
                    expense.totalAmount,
                    "text-xl font-extrabold text-gray-600 mr-2",
                    "text-base font-bold opacity-70"
                  )}
                </div>

                {(formErrors?.amount || amountTooLarge) && (
                  <ErrorMessage>
                    {t(formErrors?.amount || MONEY_AMOUNT_TOO_LARGE, {
                      max: MONEY_AMOUNT_MAX_DISPLAY,
                    })}
                  </ErrorMessage>
                )}
              </div>
            </div>
          ) : (
            <div className="">
              <p className={`${labelCase} mb-3  text-gray-500`}>
                {t("expenseForm.totalAmount")}
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="999.999"
                  className={`${numberInput} !w-full text-2xl !text-right min-w-0`}
                  value={formatIDR(expense.totalAmount)}
                  onChange={(e) => {
                    onClearFormError?.("amount");
                    const amount = parseDigitAmount(e.target.value);
                    setExpense({
                      ...expense,
                      totalAmount: amount,
                      subtotalAmount: amount,
                    });
                  }}
                />
              </div>
              {(formErrors?.amount || amountTooLarge) && (
                <ErrorMessage>
                  {t(formErrors?.amount || MONEY_AMOUNT_TOO_LARGE, {
                    max: MONEY_AMOUNT_MAX_DISPLAY,
                  })}
                </ErrorMessage>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
