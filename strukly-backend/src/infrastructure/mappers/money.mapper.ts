import Money from "src/domain/values/money";
import { Money as MoneyResponse } from "../schemas/common";

export function mapMoneyToResponse(money: Money): MoneyResponse {
  return {
    amount: money.value,
    currency: money.currency,
  };
}
