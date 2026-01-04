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

  const idFormatter = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  });
  const spentString = `${idFormatter.format(spent)}`;
  const budgetString = `${idFormatter.format(budget)}`;

  return (
    <div>
      <div className="flex py-1 items-center justify-between gap-4 ">
        {/* left */}
        <div className="flex items-center px-2">
          {/* icon */}
          <div className="">{icon}</div>
        </div>

        {/* right */}
        <div className="flex flex-col gap-1 w-full">
          {/* category, expense budget bar , expense budget text */}
          <p className="font-bold text-lg text-text-primary">{category}</p>

          <ProgressBar value={spent} max={budget} height={8} />
          <p className="text-text-disabled text-sm">
            {currency} {spentString} / {budgetString}
          </p>
        </div>
      </div>
    </div>
  );
}
