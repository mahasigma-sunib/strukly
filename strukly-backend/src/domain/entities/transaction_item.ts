import TransactionID from "../values/transaction_id";
import Money from "../values/money";
import TransactionItemID from "../values/transaction_item_id";

export interface ITransactionItemEditable {
  name: string;
  quantity: number;
  singlePrice: Money;
}

export interface ITransactionItemBuilder extends ITransactionItemEditable {
  transactionID: TransactionID;
}

export interface ITransactionItemProps extends ITransactionItemBuilder {
  id: TransactionItemID;

  totalPrice: Money;
};

export default class TransactionItem {
  public readonly id: TransactionItemID;

  public readonly name: string;

  public readonly quantity: number;
  public readonly singlePrice: Money;
  public readonly totalPrice: Money;

  public readonly transactionID: TransactionID;

  constructor(props: ITransactionItemProps) {
    this.id = props.id;
    this.name = props.name;
    this.quantity = props.quantity;
    this.singlePrice = props.singlePrice;
    this.totalPrice = props.totalPrice;
    this.transactionID = props.transactionID;
  }

  static new(props: ITransactionItemBuilder): TransactionItem {
    return new TransactionItem({
      ...props,
      id: TransactionItemID.fromRandom(),
      totalPrice: Money.newWithDefault(props.quantity * props.singlePrice.value)
    });
  }
}
