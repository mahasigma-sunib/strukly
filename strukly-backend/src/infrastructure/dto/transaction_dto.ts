import Transaction from "../../domain/aggregates/transaction";
import { MoneyDTO, moneyToDTO } from "./money_dto";
import { TransactionItemDTO, transactionItemToDTO } from "./transaction_item_dto";

export interface TransactionDTO {
  id: string;
  vendorName: string;
  category: string;
  dateTime: string; // ISO string
  
  subtotalAmount: MoneyDTO;
  taxAmount: MoneyDTO;
  discountAmount: MoneyDTO;
  serviceAmount: MoneyDTO;
  totalAmount: MoneyDTO;
  
  userID: string;
  walletID: string;

  items: TransactionItemDTO[];
}

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