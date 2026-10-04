import Money from "./Money";

type BudgetRemainingProps = {
  remaining: number;
  currency?: string;
  mainClassName?: string;
  decimalClassName?: string;
  amountColorClassName?: string;
};

export default function BudgetRemaining({
  remaining,
  currency = "IDR",
  mainClassName = "",
  decimalClassName = "",
  amountColorClassName = "",
}: BudgetRemainingProps) {
  const colorClassName = remaining < 0 ? "text-red-500" : amountColorClassName;

  return (
    <Money
      amount={remaining}
      currency={currency}
      mainClassName={`${mainClassName} ${colorClassName}`.trim()}
      decimalClassName={`${decimalClassName} ${colorClassName}`.trim()}
    />
  );
}
