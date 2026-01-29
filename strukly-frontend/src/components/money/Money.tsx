import React, { useMemo } from "react";

interface MoneyProps {
  amount: number;
  currency: string;
  locale?: string;
}

const Money: React.FC<MoneyProps> = ({
  amount,
  currency,
  locale = "id-ID", // default: Indonesia
}) => {
  const formattedMoney = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  }, [amount, currency, locale]);

  return <div>{formattedMoney}</div>;
};

export default Money;
