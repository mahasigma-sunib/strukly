import { useNavigate } from "react-router-dom";
import Card from "../components/card/Card";
import BackIcon from "../components/utilityIcons/BackIcon";
import DropDownIcon from "../components/utilityIcons/DropdownIcon";
import Dropdown from "../components/dropdown/Dropdown";
import { getCategoryData, categoryColors } from "../utils/CategoryConfig";
import { useState } from "react";
import type { ExpenseType } from "../type/ExpenseType";

export default function AddExpense() {
  const [expense, setExpense] = useState<Omit<ExpenseType, "userID">>({
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

  const navigate = useNavigate();
  const { icon } = getCategoryData(expense.category);

  function capitalizeWords(sentence: string) {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const options = Object.keys(categoryColors).map((key) => ({
    label: capitalizeWords(key),
    value: key,
  }));

  return (
    <div className="bg-[var(--fun-color-background)] min-h-screen pb-10 font-sans">
      {/* --- header --- */}
      <div className="bg-[var(--fun-color-surface)] px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-[var(--fun-color-border)]">
        <div className="flex items-center gap-5">
          <div
            onClick={() => navigate(-1)}
            className="cursor-pointer active:opacity-70 transition-opacity -ml-2"
          >
            <BackIcon width={32} height={32} />
          </div>
          <span className="font-semibold text-xl">Add Expense</span>
        </div>
      </div>

      {/* main content*/}
      <div className="p-2 m-1">
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
            <Card className="!m-0 !p-0 !rounded-md shadow-sm border-none">
              <div className="flex justify-between p-4">
                <div className="flex items-center bg-surface gap-3">
                  {icon}
                  <div className="">
                    <div className="text-text-disabled">Category</div>
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

        {/* Information */}
        <div className="">
          <Card className="!rounded-md shadow-sm border-none p-4 flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">
                Vendor Name
              </p>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex. McDonald's"
                value={expense.vendorName}
                onChange={(e) =>
                  setExpense({ ...expense, vendorName: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  Date
                </p>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={expense.dateTime.toISOString().slice(0, 10)}
                  onChange={(e) => {
                    const newDate = new Date(expense.dateTime);
                    const [y, m, d] = e.target.value.split("-").map(Number);
                    newDate.setFullYear(y, m - 1, d);
                    setExpense({ ...expense, dateTime: newDate });
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  Time
                </p>
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={expense.dateTime.toTimeString().slice(0, 5)}
                  onChange={(e) => {
                    const newDate = new Date(expense.dateTime);
                    const [h, min] = e.target.value.split(":").map(Number);
                    newDate.setHours(h, min);
                    setExpense({ ...expense, dateTime: newDate });
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
