import {
  CreateExpenseDTO,
  ExpenseDTO,
} from "src/infrastructure/dto/expense_dto";
import Expense from "src/domain/aggregates/expense";
import ExpenseHeader from "src/domain/entities/expense_header";
import ExpenseItem from "src/domain/entities/expense_item";
import ExpenseCategory from "src/domain/values/expense_category";
import ExpenseID from "src/domain/values/expense_id";
import ExpenseItemID from "src/domain/values/expense_item_id";
import Money from "src/domain/values/money";
import UserID from "src/domain/values/user_id";

export default class ExpenseMapper {
  /**
   * Map a CreateExpenseDTO + userID into a domain Expense aggregate.
   * Assumes the incoming DTO has already been validated by the controller layer.
   */
  static fromCreateDTO(userID: string, dto: CreateExpenseDTO): Expense {
    const newExpense = new Expense(
      ExpenseHeader.new({
        userID: new UserID(userID),

        dateTime: new Date(dto.dateTime),
        vendorName: dto.vendorName,
        category: ExpenseCategory.fromString(dto.category),
        subtotalAmount: Money.newWithDefault(dto.subtotalAmount.amount),
        taxAmount: Money.newWithDefault(dto.taxAmount.amount),
        discountAmount: Money.newWithDefault(dto.discountAmount.amount),
        serviceAmount: Money.newWithDefault(dto.serviceAmount.amount),
      }),
      []
    );

    for (const item of dto.items) {
      newExpense.addItem(
        ExpenseItem.new({
          name: item.name,
          quantity: item.quantity,
          singlePrice: Money.newWithDefault(item.singlePrice.amount),
          expenseID: newExpense.getExpenseID(),
        })
      );
    }

    return newExpense;
  }

  /**
   * Map a ExpenseDTO into a domain Expense aggregate.
   * @param dto The ExpenseDTO to convert
   * @returns
   */
  static fromDTO(dto: ExpenseDTO): Expense {
    const expense = new Expense(
      new ExpenseHeader({
        id: new ExpenseID(dto.id),
        userID: new UserID(dto.userID),
        dateTime: new Date(dto.dateTime),
        vendorName: dto.vendorName,
        category: ExpenseCategory.fromString(dto.category),
        subtotalAmount: Money.newWithDefault(dto.subtotalAmount.amount),
        taxAmount: Money.newWithDefault(dto.taxAmount.amount),
        discountAmount: Money.newWithDefault(dto.discountAmount.amount),
        serviceAmount: Money.newWithDefault(dto.serviceAmount.amount),
        totalAmount: Money.newWithDefault(dto.totalAmount.amount),
      }),
      []
    );

    for (const item of dto.items) {
      expense.addItem(
        new ExpenseItem({
          id: new ExpenseItemID(item.id),
          name: item.name,
          quantity: item.quantity,
          singlePrice: Money.newWithDefault(item.singlePrice.amount),
          totalPrice: Money.newWithDefault(item.totalPrice.amount),
          expenseID: expense.getExpenseID(),
        })
      );
    }

    return expense;
  }
}
