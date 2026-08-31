import Money from "./Money";

type BudgetRemainingProps = {
  remaining: number;
  currency?: string;
  mainClassName?: string;
  decimalClassName?: string;
};

function withAmountColor(className: string, isOverBudget: boolean) {
  if (!isOverBudget) {
    return className;
  }

  const withoutThemeColor = className
    .split(/\s+/)
    .filter((token) => token && !token.startsWith("text-text-"))
    .join(" ");

  return `${withoutThemeColor} text-red-500`.trim();
}

export default function BudgetRemaining({
  remaining,
  currency = "IDR",
  mainClassName = "",
  decimalClassName = "",
}: BudgetRemainingProps) {
  const isOverBudget = remaining < 0;

  return (
    <Money
      amount={remaining}
      currency={currency}
      mainClassName={withAmountColor(mainClassName, isOverBudget)}
      decimalClassName={withAmountColor(decimalClassName, isOverBudget)}
    />
  );
}
