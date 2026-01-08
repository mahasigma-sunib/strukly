import ExpenseHeader from "../entities/expense_header";
import ExpenseItem from "../entities/expense_item";
import ExpenseID from "../values/expense_id";

export type ExpenseProps = {
  header: ExpenseHeader;
  items: ExpenseItem[];
};

export default class Expense {
  constructor(
    public header: ExpenseHeader,
    public items: ExpenseItem[],
  ) {}

  getExpenseID(): ExpenseID {
    return this.header.id;
  }

  addItem(item: ExpenseItem) {
    this.items.push(item);
  }

  removeItem(itemID: ExpenseID) {
    this.items = this.items.filter((item) => item.id.value !== itemID.value);
  }

  updateHeader(header: Partial<ExpenseHeader>) {
    this.header.update(header);
  }

  updateItems(items: ExpenseItem[]) {
    this.items = items;
  }
}
