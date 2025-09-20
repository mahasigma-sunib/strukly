import Money from "../values/money";
import TransactionCategory from "../values/transaction_category";
import TransactionID from "../values/transaction_id"
import UserID from "../values/user_id";

export interface ITransactionDescriptorEditable {
  dateTime: Date;

  vendorName: string;
  category: TransactionCategory;
  subtotalAmount: Money;
  taxAmount: Money;
  discountAmount: Money;
  serviceAmount: Money;

  walletID: string; // WalletID not implemented
}

export interface ITransactionDescriptorBuider extends ITransactionDescriptorEditable {
  userID: UserID;
}

export interface ITransactionDescriptorProps extends ITransactionDescriptorBuider {
  id: TransactionID;

  totalAmount: Money;
}

export default class TransactionDescriptor {
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

  constructor(props: ITransactionDescriptorProps) {
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

  static new(props: ITransactionDescriptorBuider): TransactionDescriptor {
    return new TransactionDescriptor({
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