import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { ExpenseType } from "../type/ExpenseType";
import type { ExpenseItemType } from "../type/ExpenseItemType";
import { getCategoryData, categoryColors } from "../utils/CategoryConfig";

import Button from "../components/button/Button";
import Card from "../components/card/Card";
import Dropdown from "../components/dropdown/Dropdown";
import Toggle from "../components/button/ToggleButton";
import BackIcon from "../components/utilityIcons/BackIcon";
import DropDownIcon from "../components/utilityIcons/DropdownIcon";

interface Props {
  expense?: Omit<ExpenseType, "userID">;
  setExpense?: React.Dispatch<
    React.SetStateAction<Omit<ExpenseType, "userID">>
  >;
}

export default function AddExpense(props: Props) {
  const [localExpense, setLocalExpense] = useState<Omit<ExpenseType, "userID">>({
    id: "",
    dateTime: new Date(),
    vendorName: "",
    category: "food",

    currency: "",
    subtotalAmount: 0,
    taxAmount: 0,
    discountAmount: 0,
    serviceAmount: 0,
    totalAmount: 0,

    items: [],
  });

  const expense = props.expense || localExpense;
  const setExpense = props.setExpense || setLocalExpense;

  const [isDetailed, setIsDetailed] = useState(expense.items.length > 0);
  const navigate = useNavigate();
  const { icon } = getCategoryData(expense.category);

  const handleToggleDetailed = (enabled: boolean) => {
    if (enabled && expense.items.length === 0) addItem();
    setIsDetailed(enabled);
  };

  const addItem = () => {
    const newItem: ExpenseItemType = {
      expenseID: expense.id,
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      singleItemPrice: 0,
      totalPrice: 0,
    };
    setExpense({ ...expense, items: [...expense.items, newItem] });
  };

  const updateItem = (
    index: number,
    field: keyof ExpenseItemType,
    value: any
  ) => {
    const newItems = [...expense.items];
    const targetItem = { ...newItems[index], [field]: value };

    if (field === "singleItemPrice" || field === "quantity") {
      const numVal = Math.max(0, Number(value));
      targetItem[field] = numVal as never;
      targetItem.totalPrice = targetItem.singleItemPrice * targetItem.quantity;
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

  /* ---------- calculation ---------- */
  useEffect(() => {
    if (!isDetailed) return;

    const subtotal = expense.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const total =
      subtotal +
      expense.taxAmount +
      expense.serviceAmount -
      expense.discountAmount;

    if (subtotal !== expense.subtotalAmount || total !== expense.totalAmount) {
      setExpense((prev) => ({
        ...prev,
        subtotalAmount: subtotal,
        totalAmount: total,
      }));
    }
  }, [
    expense.items,
    expense.taxAmount,
    expense.serviceAmount,
    expense.discountAmount,
    isDetailed,
  ]);

  /* ---------- utils ---------- */
  const capitalizeWords = (sentence: string) =>
    sentence
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const options = Object.keys(categoryColors).map((key) => ({
    label: capitalizeWords(key),
    value: key,
  }));

  const validDate =
    expense.dateTime instanceof Date
      ? expense.dateTime
      : new Date(expense.dateTime);

  const formatIDR = (value: number) =>
    value ? value.toLocaleString("id-ID") : "";

  const parseNumber = (value: string) => Number(value.replace(/\./g, "")) || 0;

  const labelCase = "text-sm font-bold text-gray-400";

  const inputBase =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500";

  const numberInput =
    "w-32 text-right border border-gray-300 rounded-lg px-4 py-2 font-bold outline-none";

  return (
    <div className="bg-[var(--fun-color-background)] min-h-screen pb-10 font-sans">
      {/* header */}
      <div className="bg-[var(--fun-color-surface)] px-6 py-4 flex items-center sticky top-0 z-10 shadow-sm border-b border-[var(--fun-color-border)]">
        <div
          onClick={() => navigate(-1)}
          className="cursor-pointer active:opacity-70 transition-opacity -ml-2 mr-4"
        >
          <BackIcon width={32} height={32} />
        </div>
        <span className="font-semibold text-xl">Add Expense</span>
      </div>

      {/* main content */}
      <div className="p-2 m-1 flex flex-col gap-2">
        {/* DO NOT TOUCH THIS, it is for the card size consistency */}

        {/* Category */}
        <div className="flex justify-center">
          <Dropdown
            options={options}
            onChange={(opt) =>
              setExpense({ ...expense, category: opt.value as string })
            }
            selected={{
              label: capitalizeWords(expense.category),
              value: expense.category,
            }}
          >
            <Card className="!m-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <div className="text-xs text-gray-400">Category</div>
                    <div className="font-semibold">
                      {capitalizeWords(expense.category)}
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
            <p className={`${labelCase} mb-2`}>Vendor Name</p>
            <input
              className={inputBase}
              placeholder="Ex. McDonald's"
              value={expense.vendorName}
              onChange={(e) =>
                setExpense({ ...expense, vendorName: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <p className={`${labelCase} mb-2`}>Date</p>
              <input
                type="date"
                className={inputBase}
                value={validDate.toISOString().slice(0, 10)}
                onChange={(e) => {
                  const [y, m, d] = e.target.value.split("-").map(Number);
                  const newDate = new Date(validDate);
                  newDate.setFullYear(y, m - 1, d);
                  setExpense({ ...expense, dateTime: newDate });
                }}
              />
            </div>

            <div className="flex-1">
              <p className={`${labelCase} mb-2`}>Time</p>
              <input
                type="time"
                className={inputBase}
                value={validDate.toTimeString().slice(0, 5)}
                onChange={(e) => {
                  const [h, min] = e.target.value.split(":").map(Number);
                  const newDate = new Date(validDate);
                  newDate.setHours(h, min);
                  setExpense({ ...expense, dateTime: newDate });
                }}
              />
            </div>
          </div>
        </Card>

        {/* Toggle */}
        <div className="flex items-center justify-between px-5">
          <span className={`${labelCase}  text-gray-500`}>
            Detailed Receipt
          </span>
          <Toggle enabled={isDetailed} onChange={handleToggleDetailed} />
        </div>

        {/* Receipt */}
        <Card className="p-6">
          {isDetailed ? (
            <div className="flex flex-col gap-6">
              <h3 className={`${labelCase}`}>Items List</h3>

              {expense.items.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="text-gray-400 text-xl px-1"
                    >
                      &#10005;
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      className="w-32 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium"
                      placeholder="Price"
                      value={item.singleItemPrice || ""}
                      onChange={(e) =>
                        updateItem(index, "singleItemPrice", e.target.value)
                      }
                    />

                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                      <input
                        type="number"
                        className="w-8 text-center text-sm font-medium outline-none"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                      />
                      <span className="text-xs font-bold text-gray-400 ml-1">
                        &#215;
                      </span>
                    </div>

                    <div className="flex-1 text-right font-bold text-gray-600 mr-2">
                      {item.totalPrice.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addItem}
                className="w-full py-3 border border-blue-500 rounded-xl text-blue-500 font-bold"
              >
                &#43; Add Item
              </button>

              <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Subtotal</span>
                  <span className="font-bold mr-2">
                    {expense.subtotalAmount.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Pajak</span>
                  <input
                    type="number"
                    className={numberInput}
                    value={expense.taxAmount || ""}
                    onChange={(e) =>
                      setExpense({
                        ...expense,
                        taxAmount: Math.max(0, Number(e.target.value)),
                      })
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Service</span>
                  <input
                    type="number"
                    className={numberInput}
                    value={expense.serviceAmount || ""}
                    onChange={(e) =>
                      setExpense({
                        ...expense,
                        serviceAmount: Math.max(0, Number(e.target.value)),
                      })
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Diskon</span>
                  <input
                    type="number"
                    className={`${numberInput} text-red-500`}
                    value={expense.discountAmount || ""}
                    onChange={(e) =>
                      setExpense({
                        ...expense,
                        discountAmount: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-bold text-gray-500">Total</span>
                  <span className="text-xl font-black text-gray-900 mr-2">
                    {expense.totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="">
              <p className={`${labelCase} mb-3  text-gray-500`}>Total Amount</p>
              <input
                type="text"
                inputMode="numeric"
                placeholder="999.999"
                className={`${numberInput} !w-full text-3xl !text-right`}
                value={formatIDR(expense.totalAmount)}
                onChange={(e) => {
                  const raw = parseNumber(e.target.value);
                  setExpense({
                    ...expense,
                    totalAmount: raw,
                    subtotalAmount: raw,
                  });
                }}
              />
            </div>
          )}
        </Card>

        <div className="flex justify-center mt-6">
          <Button>Add Expense</Button>
        </div>
      </div>
    </div>
  );
}
