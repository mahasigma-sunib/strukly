import TransactionID from "../values/transaction_id";
import Money from "../values/money";
import TransactionItemID from "../values/transaction_item_id";

export type TransactionItemProps = {
  id: TransactionItemID;
  name: string;
  quantity: number;
  singlePrice: Money;
  transactionID: TransactionID;
};

export default class TransactionItem {
  public readonly id: TransactionItemID;
  public readonly name: string;
  public readonly quantity: number;
  public readonly singlePrice: Money;
  public readonly transactionID: TransactionID;

  constructor(props: TransactionItemProps) {
    this.id = props.id;
    this.name = props.name;
    this.quantity = props.quantity;
    this.singlePrice = props.singlePrice;
    this.transactionID = props.transactionID;
  }

  static new(props: Omit<TransactionItem, "id">): TransactionItem {
    return new TransactionItem({
      ...props,
      id: TransactionItemID.fromRandom(),
    });
  }
}
