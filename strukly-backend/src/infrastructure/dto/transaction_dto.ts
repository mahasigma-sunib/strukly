import { z } from "zod";
import Transaction from "../../domain/aggregates/transaction";
import { moneyToDTO, MoneyDTOSchema } from "./money_dto";
import { transactionItemToDTO, TransactionItemDTOSchema, CreateTransactionItemDTOSchema } from "./transaction_item_dto";

export const CreateTransactionDTOSchema = z.object({
  vendorName: z.string(),
  category: z.string(),
  dateTime: z.iso.datetime(),

  subtotalAmount: MoneyDTOSchema,
  taxAmount: MoneyDTOSchema,
  discountAmount: MoneyDTOSchema,
  serviceAmount: MoneyDTOSchema,
  
  walletID: z.uuid("Invalid wallet ID format"),
  
  items: z.array(CreateTransactionItemDTOSchema),
});

export const TransactionDTOSchema = CreateTransactionDTOSchema.extend({
  id: z.uuid("Invalid transaction ID format"),
  totalAmount: MoneyDTOSchema,
  userID: z.uuid("Invalid user ID format"),
  items: z.array(TransactionItemDTOSchema),
});

export type CreateTransactionDTO = z.infer<typeof CreateTransactionDTOSchema>;
export type TransactionDTO = z.infer<typeof TransactionDTOSchema>;

export function transactionToDTO(transaction: Transaction): TransactionDTO {
  return {
    id: transaction.header.id.value,
    vendorName: transaction.header.vendorName,
    category: transaction.header.category.value,
    dateTime: transaction.header.dateTime.toISOString(),

    subtotalAmount: moneyToDTO(transaction.header.subtotalAmount),
    taxAmount: moneyToDTO(transaction.header.taxAmount),
    discountAmount: moneyToDTO(transaction.header.discountAmount),
    serviceAmount: moneyToDTO(transaction.header.serviceAmount),
    totalAmount: moneyToDTO(transaction.header.totalAmount),

    userID: transaction.header.userID.value,
    walletID: transaction.header.walletID,

    items: transaction.items.map((item) => transactionItemToDTO(item)),
  };
}
