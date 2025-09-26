import TransactionDescriptor from "../entities/transaction_descriptor";
import TransactionItem from "../entities/transaction_item";
import TransactionID from "../values/transaction_id";

export type TransactionProps = {
  descriptor: TransactionDescriptor;
  items: TransactionItem[];
};

export default class Transaction {
  constructor(public descriptor: TransactionDescriptor, public items: TransactionItem[]) { }

  getTransactionID(): TransactionID {
    return this.descriptor.id;
  }

  addItem(item: TransactionItem) {
    this.items.push(item);
  }

  removeItem(itemID: TransactionID) {
    this.items = this.items.filter(item => item.id !== itemID);
  }
}