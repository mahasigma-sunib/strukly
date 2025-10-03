import TransactionHeader from "../entities/transaction_header";
import TransactionItem from "../entities/transaction_item";
import TransactionID from "../values/transaction_id";

export type TransactionProps = {
  header: TransactionHeader;
  items: TransactionItem[];
};

export default class Transaction {
  constructor(public header: TransactionHeader, public items: TransactionItem[]) { }

  getTransactionID(): TransactionID {
    return this.header.id;
  }

  addItem(item: TransactionItem) {
    this.items.push(item);
  }

  removeItem(itemID: TransactionID) {
    this.items = this.items.filter(item => item.id.value !== itemID.value);
  }
}