import { getCategoryData } from "../../utils/CategoryConfig";
import ProgressBar from "../graph/ProgressBar";

interface BudgetListProps {
  currency: string;
  spent: number;
  usedBudget: number;
  category: string;
}

export default function BudgetListCard({
  currency,
  spent,
  usedBudget,
  category,
}: BudgetListProps) {
  const { icon, color } = getCategoryData(category.toLowerCase());

  const percent =
    usedBudget > 0 ? Number(((spent / usedBudget) * 100).toFixed(2)) : 0;

  const formatIDR = (value: number) =>
    value ? value.toLocaleString("id-ID") : "0";

  return (
    <div>
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-text-primary text-base capitalize">
              {category}
            </span>
            <span className="text-sm text-text-secondary">
              -{currency} {formatIDR(spent)}
            </span>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-base font-bold text-text-secondary">
          {percent}%
        </div>
      </div>

      {/* Progress bar */}
      {/* <ProgressBar
        value={spent}
        max={usedBudget}
        height="h-3"
        color={color}
        className="!mt-4"
      /> */}

      <ProgressBar
        value={spent}
        max={usedBudget}
        height={10}
        barColor={color}
        className="!mt-4"
      />
    </div>
  );
}
