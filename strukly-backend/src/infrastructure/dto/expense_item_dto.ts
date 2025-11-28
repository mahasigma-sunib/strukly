import { z } from "zod";
import ExpenseItem from "../../domain/entities/expense_item";
import { moneyToDTO, MoneyDTOSchema } from "./money_dto";

export const CreateExpenseItemDTOSchema = z.object({
  name: z.string().min(1, "Item name is required").max(255, "Item name too long"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  singlePrice: MoneyDTOSchema,
});

export const ExpenseItemDTOSchema = CreateExpenseItemDTOSchema.extend({
  id: z.uuid("Invalid expense item ID format"),
  totalPrice: MoneyDTOSchema,
  expenseID: z.uuid("Invalid expense ID format"),
});

export type CreateExpenseItemDTO = z.infer<typeof CreateExpenseItemDTOSchema>;
export type ExpenseItemDTO = z.infer<typeof ExpenseItemDTOSchema>;

export function expenseItemToDTO(item: ExpenseItem): ExpenseItemDTO {
  return {
    id: item.id.value,

    name: item.name,
    quantity: item.quantity,
    singlePrice: moneyToDTO(item.singlePrice),
    totalPrice: moneyToDTO(item.totalPrice),

    expenseID: item.expenseID.value,
  };
}
