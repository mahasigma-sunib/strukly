interface ExpenseListProps {
  icon: React.ReactNode;
  vendorName: string;
  date: Date;
  currency: string;
  amount: string;
  category: keyof typeof categoryColors; // <-- keep this
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

export default function ExpenseList({
  icon,
  vendorName,
  date,
  currency,
  amount,
  category,   // <-- add category here
}: ExpenseListProps) {
  return (
    <div className="w-full flex items-center justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* Category icon with dynamic background */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
          style={{ backgroundColor: categoryColors[category] }}
        >
          {icon}
        </div>

        {/* Vendor + Date */}
        <div>
          <p className="font-semibold text-neutral-900">{vendorName}</p>
          <p className="text-neutral-500 text-sm">
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

      {/* RIGHT SIDE */}
      <div className="text-right">
        <p className="font-semibold text-neutral-600">
          {currency}
          {amount}
        </p>
      </div>
    </div>
  );
}
