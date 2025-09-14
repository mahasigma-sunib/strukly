import TransactionDescriptor from "../entities/transaction_descriptor";
import TransactionItem from "../entities/transaction_item";
import TransactionID from "../values/transaction_id";

export type TransactionProps = {
  descriptor: TransactionDescriptor;
  items: TransactionItem[];
};

export default class Transaction {
  constructor(private descriptor: TransactionDescriptor, private items: TransactionItem[]) { }

  getTransactionID(): TransactionID {
    return this.descriptor.id;
  }
}