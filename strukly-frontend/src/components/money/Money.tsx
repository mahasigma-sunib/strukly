import React, { useMemo } from "react";

interface MoneyProps {
  amount: number;
  currency: string;
  locale?: string;
  className?: string;
  mainClassName?: string; // Main number & currency (10.000)
  decimalClassName?: string; // Decimal number (,00)
}

const Money: React.FC<MoneyProps> = ({
  amount,
  currency,
  locale = "id-ID", // default: Indonesia
  className = "",
  mainClassName = "",
  decimalClassName = "",
}) => {
  const moneyParts = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).formatToParts(amount);
  }, [amount, currency, locale]);

  return (
    <div className="flex flex-row items-end">
      <div className={className}>
        {moneyParts.map((part, index) => {
          if (part.type === "literal") return null;

          let partClass = "";
          switch (part.type) {
            case "currency":
            case "integer":
            case "group": // the thousands separator.
              partClass = mainClassName;
              break;
            case "decimal":
            case "fraction":
              partClass = decimalClassName;
              break;
            default:
              partClass = "";
          }

          return (
            <span key={index} className={partClass}>
              {part.value}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Money;
