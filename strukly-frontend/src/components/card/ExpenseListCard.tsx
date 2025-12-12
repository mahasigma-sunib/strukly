import { getCategoryData } from "../../utils/CategoryConfig";

interface ExpenseListProps {
  vendorName: string;
  date: Date;
  currency: string;
  amount: string;
  category: string;
}

export default function ExpenseList({
  vendorName,
  date,
  currency,
  amount,
  category,
}: ExpenseListProps) {
  const { icon } = getCategoryData(category);
  return (
    <div>
      <div className="flex items-center justify-between">
        {/* left */}
        <div className="flex gap-4 items-center">
          {/* icon */}
          <div className="">{icon}</div>

          {/* vendor, date */}
          <div>
            <p className="font-bold text-[fun-color-text-primary]">
              {vendorName}
            </p>
            <p className="text-[fun-color-text-secondary] text-sm">
              {date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* right */}
        <div className="text-right">
          <p>
            {currency}
            {amount}
          </p>
        </div>
      </div>
    </div>
  );
}
