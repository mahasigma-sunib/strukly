import Money from "../../domain/values/money";

export interface MoneyDTO {
  amount: number;
  currency: string;
}

export function moneyToDTO(money: Money): MoneyDTO {
  return {
    amount: money.value,
    currency: money.currency,
  };
}

export function dtoToMoney(dto: MoneyDTO): Money {
  return new Money(dto.amount, dto.currency);
}