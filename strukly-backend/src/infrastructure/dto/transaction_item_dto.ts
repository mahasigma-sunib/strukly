import { z } from "zod";
import TransactionItem from "../../domain/entities/transaction_item";
import { moneyToDTO, MoneyDTOSchema } from "./money_dto";

export const CreateTransactionItemDTOSchema = z.object({
  name: z.string().min(1, "Item name is required").max(255, "Item name too long"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  singlePrice: MoneyDTOSchema,
});

export const TransactionItemDTOSchema = CreateTransactionItemDTOSchema.extend({
  id: z.uuid("Invalid transaction item ID format"),
  totalPrice: MoneyDTOSchema,
  transactionID: z.uuid("Invalid transaction ID format"),
});

export type CreateTransactionItemDTO = z.infer<typeof CreateTransactionItemDTOSchema>;
export type TransactionItemDTO = z.infer<typeof TransactionItemDTOSchema>;

export function transactionItemToDTO(item: TransactionItem): TransactionItemDTO {
  return {
    id: item.id.value,

    name: item.name,
    quantity: item.quantity,
    singlePrice: moneyToDTO(item.singlePrice),
    totalPrice: moneyToDTO(item.totalPrice),

    transactionID: item.transactionID.value,
  };
}
