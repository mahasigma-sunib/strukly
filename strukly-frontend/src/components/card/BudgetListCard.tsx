import { getCategoryData } from "../../utils/CategoryConfig";
import ProgressBar from "../graph/ProgressBar";

interface BudgetListProps {
  currency: string;
  spent: number;
  budget: number;
  category: string;
}

export default function BudgetList({
  currency,
  spent,
  budget,
  category,
}: BudgetListProps) {
  const { icon } = getCategoryData(category);

  const spentNum = spent;
  const budgetNum = budget;

  const idFormatter = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  });
  const spentString = `${idFormatter.format(spentNum)}`;
  const budgetString = `${idFormatter.format(budgetNum)}`;

  return (
    <div>
      <div className="flex items-center">
        {/* left */}
        <div className="flex gap-4 items-center w-1/4">
          {/* icon */}
          <div className="">{icon}</div>
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
