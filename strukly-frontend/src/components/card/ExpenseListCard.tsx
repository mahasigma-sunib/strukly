import { getCategoryData } from "../../utils/CategoryConfig";
import Money from "../money/Money";
import { formatIDRDisplay } from "../money/formatIDRDisplay";

interface ExpenseListProps {
  vendorName: string;
  date: Date;
  amount: string;
  category: string;
}

export default function ExpenseList({
  vendorName,
  date,
  amount,
  category,
}: ExpenseListProps) {
  const { icon } = getCategoryData(category);
  const numericAmount = Number(amount);
  const hasNumericAmount = Number.isFinite(numericAmount);

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* left */}
        <div className="flex gap-4 items-center min-w-0 flex-1">
          {/* icon */}
          <div className="shrink-0">{icon}</div>

          {/* vendor, date */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="font-bold text-text-primary text-lg truncate">
              {vendorName}
            </p>
            <p className="text-light-gray text-sm font-bold truncate">
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
        <div className="min-w-0 max-w-[45%] text-right text-md font-bold text-text-secondary">
          {hasNumericAmount ? (
            <div
              className="min-w-0 flex justify-end items-baseline"
              title={`-${formatIDRDisplay(numericAmount)}`}
            >
              <span>-</span>
              <Money
                amount={numericAmount}
                currency="IDR"
                decimalClassName="text-xs font-bold opacity-70"
              />
            </div>
          ) : (
            <p className="truncate" title={`-${amount}`}>
              -{amount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
