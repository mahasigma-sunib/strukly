import { z } from "zod";
import Money from "../../domain/values/money";

// Zod schema for MoneyDTO validation
export const MoneyDTOSchema = z.object({
  amount: z.number("Amount must be a number"),
  currency: z.string().min(1, "Currency is required").max(3, "Currency code should be 3 characters or less"),
});

export type MoneyDTO = z.infer<typeof MoneyDTOSchema>;

export function moneyToDTO(money: Money): MoneyDTO {
  return {
    amount: money.value,
    currency: money.currency,
  };
}

export function dtoToMoney(dto: MoneyDTO): Money {
  return new Money(dto.amount, dto.currency);
}