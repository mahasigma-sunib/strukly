import FoodIcon from "../categoryIcons/FoodIcon";
import GroceriesIcon from "../categoryIcons/GroceriesIcon";
import VehicleIcon from "../categoryIcons/VehicleIcon";
import ShoppingIcon from "../categoryIcons/ShoppingIcon";
import EntertainmentIcon from "../categoryIcons/EntertainmentIcon";
import OthersIcon from "../categoryIcons/OthersIcon";
import UtilityIcon from "../categoryIcons/UtilityIcons";
import ProgressBar from "../graph/ProgressBar";
import type React from "react";

interface BudgetListProps {
  currency: string;
  spent: number;
  budget: number;
  category: keyof typeof categoryColors;
}

const categoryColors: Record<string, string> = {
  Food: "var(--fun-color-category-food)",
  Groceries: "var(--fun-color-category-groceries)",
  Transportation: "var(--fun-color-category-transportation)",
  Utilities: "var(--fun-color-category-housebills)",
  Shopping: "var(--fun-color-category-shopping)",
  Entertainment: "var(--fun-color-category-entertainment)",
  Others: "var(--fun-color-category-others)",
};

const categoryIconMap: Record<keyof typeof categoryColors, React.ReactNode> = {
  Food: <FoodIcon />,
  Groceries: <GroceriesIcon />,
  Transportation: <VehicleIcon />,
  Shopping: <ShoppingIcon />,
  Entertainment: <EntertainmentIcon />,
  Utilities: <UtilityIcon />,
  Others: <OthersIcon />,
};

export default function BudgetList({
  currency,
  spent,
  budget,
  category,
}: BudgetListProps) {

  const spentNum = spent;
  const budgetNum = budget;

  const idFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
  const spentString = `${idFormatter.format(spentNum)}`;
  const budgetString = `${idFormatter.format(budgetNum)}`;

  return (
    <div>
      <div className="flex items-center">
        {/* left */}
        <div className="flex gap-4 items-center w-1/4">
          {/* icon */}
          <div className="">{categoryIconMap[category]}</div>
        </div>

        {/* right */}
        <div className="gap-4 items-center w-3/4">
          {/* category, expense budget bar , expense budget text */}
          <p className="font-bold text-[fun-color-text-primary]">{category}</p>

          <ProgressBar value={spentNum} max={budgetNum} height={8} />
          <p className="text-[fun-color-text-secondary] text-xs">
            {currency} {spentString} / {budgetString}
          </p>
        </div>
      </div>
    </div>
  );
}