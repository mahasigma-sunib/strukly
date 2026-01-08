import { getCategoryData } from "../../utils/CategoryConfig";

interface ExpenseListProps {
  vendorName: string;
  date: Date;
  currency: string;
  amount: number;
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
  const formatIDR = (value: number) =>
    value ? value.toLocaleString("id-ID") : "0";

  return (
    <div>
      <div className="flex items-center justify-between">
        {/* left */}
        <div className="flex gap-4 items-center">
          {/* icon */}
          <div className="">{icon}</div>

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
        <div className="text-right text-sm font-semibold text-text-secondary">
          <p>
            -{currency}
            {formatIDR(amount)}
          </p>
        </div>
      </div>
    </div>
  );
}
