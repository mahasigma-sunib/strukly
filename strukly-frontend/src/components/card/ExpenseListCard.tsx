import FoodIcon from "../categoryIcons/FoodIcon";
import GroceriesIcon from "../categoryIcons/GroceriesIcon";
import VehicleIcon from "../categoryIcons/VehicleIcon";
import ShoppingIcon from "../categoryIcons/ShoppingIcon";
import EntertainmentIcon from "../categoryIcons/EntertainmentIcon";
import OthersIcon from "../categoryIcons/OthersIcon";
import UtilityIcon from "../categoryIcons/UtilityIcons";
import type React from "react";

interface ExpenseListProps {
  vendorName: string;
  date: Date;
  currency: string;
  amount: string;
  category: keyof typeof categoryColors;
}

const categoryColors: Record<string, string> = {
  food: "var(--fun-color-category-food)",
  groceries: "var(--fun-color-category-groceries)",
  transportation: "var(--fun-color-category-transportation)",
  housebills: "var(--fun-color-category-housebills)",
  shopping: "var(--fun-color-category-shopping)",
  entertainment: "var(--fun-color-category-entertainment)",
  others: "var(--fun-color-category-others)",
};

const categoryIconMap: Record<keyof typeof categoryColors, React.ReactNode> = {
  food: <FoodIcon />,
  groceries: <GroceriesIcon />,
  transportation: <VehicleIcon />,
  shopping: <ShoppingIcon />,
  entertainment: <EntertainmentIcon />,
  housebills: <UtilityIcon />,
  others: <OthersIcon />,
};

export default function ExpenseList({
  vendorName,
  date,
  currency,
  amount,
  category,
}: ExpenseListProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        {/* left */}
        <div className="flex gap-4 items-center">
          {/* icon */}
          <div className="">{categoryIconMap[category]}</div>

          {/* vendor, date */}
          <div className="flex flex-col gap-0.5">
            <p className="font-bold text-text-primary text-lg">{vendorName}</p>
            <p className="text-light-gray text-sm font-bold">
              {date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              {", "}
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* right */}
        <div className="text-right text-md font-bold text-text-secondary">
          <p>
            {currency}
            {amount}
          </p>
        </div>
      </div>
    </div>
  );
}
