import Money from "../values/money";
import TransactionCategory from "../values/transaction_category";
import TransactionID from "../values/transaction_id"
import UserID from "../values/user_id";

export interface ITransactionHeaderEditable {
  dateTime: Date;

  vendorName: string;
  category: TransactionCategory;
  subtotalAmount: Money;
  taxAmount: Money;
  discountAmount: Money;
  serviceAmount: Money;

  walletID: string; // WalletID not implemented
}

export interface ITransactionHeaderBuider extends ITransactionHeaderEditable {
  userID: UserID;
}

export interface ITransactionHeaderProps extends ITransactionHeaderBuider {
  id: TransactionID;

  totalAmount: Money;
}

export default class TransactionHeader {
  public readonly id: TransactionID;

  public readonly dateTime: Date;
  public readonly vendorName: string;
  public readonly category: TransactionCategory;
  public readonly subtotalAmount: Money;
  public readonly taxAmount: Money;
  public readonly discountAmount: Money;
  public readonly serviceAmount: Money;

  public readonly totalAmount: Money;

  public readonly userID: UserID;
  public readonly walletID: string;

  constructor(props: ITransactionHeaderProps) {
    this.id = props.id;
    this.dateTime = props.dateTime;
    this.vendorName = props.vendorName;
    this.category = props.category;
    this.subtotalAmount = props.subtotalAmount;
    this.taxAmount = props.taxAmount;
    this.discountAmount = props.discountAmount;
    this.serviceAmount = props.serviceAmount;

    this.totalAmount = props.totalAmount;

    this.userID = props.userID;
    this.walletID = props.walletID;
  }

  static new(props: ITransactionHeaderBuider): TransactionHeader {
    return new TransactionHeader({
      ...props,
      id: TransactionID.fromRandom(),
      totalAmount: Money.sum([
        props.subtotalAmount,
        props.taxAmount,
        props.serviceAmount,
        Money.negate(props.discountAmount)
      ])
    });
  }
}