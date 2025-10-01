import TransactionItem from "../../domain/entities/transaction_item";
import { MoneyDTO, moneyToDTO } from "./money_dto";

export interface TransactionItemDTO {
  id: string;

  name: string;
  quantity: number;
  singlePrice: MoneyDTO;

  transactionID: string;
}

export function transactionItemToDTO(item: TransactionItem): TransactionItemDTO {
  return {
    id: item.id.value,

    name: item.name,
    quantity: item.quantity,
    singlePrice: moneyToDTO(item.singlePrice),

    transactionID: item.transactionID.value,
  };
}