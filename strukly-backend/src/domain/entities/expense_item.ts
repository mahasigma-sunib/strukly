import Money from "../values/money";
import ExpenseID from "../values/expense_id";
import ExpenseItemID from "../values/expense_item_id";

export interface IExpenseItemEditable {
  name: string;
  quantity: number;
  singlePrice: Money;
}

export interface IExpenseItemBuilder extends IExpenseItemEditable {
  expenseID: ExpenseID;
}

export interface IExpenseItemProps extends IExpenseItemBuilder {
  id: ExpenseItemID;

  totalPrice: Money;
}

export default class ExpenseItem {
  public readonly id: ExpenseItemID;

  public readonly name: string;

  public readonly quantity: number;
  public readonly singlePrice: Money;
  public readonly totalPrice: Money;

  public readonly expenseID: ExpenseID;

  constructor(props: IExpenseItemProps) {
    this.id = props.id;
    this.name = props.name;
    this.quantity = props.quantity;
    this.singlePrice = props.singlePrice;
    this.totalPrice = props.totalPrice;
    this.expenseID = props.expenseID;
  }

  static new(props: IExpenseItemBuilder): ExpenseItem {
    return new ExpenseItem({
      ...props,
      id: ExpenseItemID.fromRandom(),
      totalPrice: Money.newWithDefault(
        props.quantity * props.singlePrice.value
      ),
    });
  }
}
