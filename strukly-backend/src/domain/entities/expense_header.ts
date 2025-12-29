import Money from "../values/money";
import UserID from "../values/user_id";
import ExpenseCategory from "../values/expense_category";
import ExpenseID from "../values/expense_id";

export interface IExpenseHeaderEditable {
  dateTime: Date;

  vendorName: string;
  category: ExpenseCategory;
  subtotalAmount: Money;
  taxAmount: Money;
  discountAmount: Money;
  serviceAmount: Money;
}

export interface IExpenseHeaderBuilder extends IExpenseHeaderEditable {
  userID: UserID;
}

export interface IExpenseHeaderProps extends IExpenseHeaderBuilder {
  id: ExpenseID;

  totalAmount: Money;
}

export default class ExpenseHeader {
  public readonly id: ExpenseID;

  public dateTime: Date;
  public vendorName: string;
  public category: ExpenseCategory;
  public subtotalAmount: Money;
  public taxAmount: Money;
  public discountAmount: Money;
  public serviceAmount: Money;

  public totalAmount: Money;

  public readonly userID: UserID;

  constructor(props: IExpenseHeaderProps) {
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
  }

  static new(props: IExpenseHeaderBuilder): ExpenseHeader {
    return new ExpenseHeader({
      ...props,
      id: ExpenseID.fromRandom(),
      totalAmount: Money.sum([
        props.subtotalAmount,
        props.taxAmount,
        props.serviceAmount,
        Money.negate(props.discountAmount),
      ]),
    });
  }

  update(props: Partial<IExpenseHeaderEditable>) {
    this.dateTime = props.dateTime ?? this.dateTime;
    this.vendorName = props.vendorName ?? this.vendorName;
    this.category = props.category ?? this.category;
    this.subtotalAmount = props.subtotalAmount ?? this.subtotalAmount;
    this.taxAmount = props.taxAmount ?? this.taxAmount;
    this.discountAmount = props.discountAmount ?? this.discountAmount;
    this.serviceAmount = props.serviceAmount ?? this.serviceAmount;

    this.totalAmount = Money.sum([
      this.subtotalAmount,
      this.taxAmount,
      this.serviceAmount,
      Money.negate(this.discountAmount),
    ]);
  }
}
