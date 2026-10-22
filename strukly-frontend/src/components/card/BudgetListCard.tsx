import { useTranslation } from "react-i18next";
import { getCategoryData } from "../../utils/CategoryConfig";
import ProgressBar from "../graph/ProgressBar";
import Money from "../money/Money";

interface BudgetListProps {
  spent: number;
  usedBudget: number;
  category: string;
}

export default function BudgetListCard({
  spent,
  usedBudget,
  category,
}: BudgetListProps) {
  const { t } = useTranslation();
  const { icon, color } = getCategoryData(category.toLowerCase());

  const percent =
    usedBudget > 0 ? Number(((spent / usedBudget) * 100).toFixed(2)) : 0;

  return (
    <div>
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${color}`}
          >
            {icon}
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-text-primary text-base">
              {t(`category.${category.toLowerCase()}`)}
            </span>
            <div className="flex items-baseline text-sm text-text-secondary">
              <span>-</span>
              <Money
                amount={spent}
                currency="IDR"
                decimalClassName="text-xs opacity-70"
              />
            </div>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-base font-bold text-text-secondary">
          {percent}%
        </div>
      </div>

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
