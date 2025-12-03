import { PrismaClient } from "@prisma/client";
import IExpenseRepository from "../../domain/repositories/expense_repository";
import Expense from "../../domain/aggregates/expense";
import ExpenseHeader from "../../domain/entities/expense_header";
import ExpenseItem from "../../domain/entities/expense_item";
import ExpenseCategory from "../../domain/values/expense_category";
import Money from "../../domain/values/money";
import UserID from "../../domain/values/user_id";
import ExpenseItemID from "../../domain/values/expense_item_id";
import ExpenseID from "../../domain/values/expense_id";

export default class PrismaExpenseRepository
  implements IExpenseRepository
{
  constructor(private readonly prisma: PrismaClient) { }

  async create(expense: Expense): Promise<Expense> {
    const createdExpense = await this.prisma.expenseHeader.create({
      data: {
        id: expense.header.id.value,
        dateTime: expense.header.dateTime,
        vendorName: expense.header.vendorName,
        category: expense.header.category.value,
        subtotalAmount: expense.header.subtotalAmount.value,
        taxAmount: expense.header.taxAmount.value,
        discountAmount: expense.header.discountAmount.value,
        serviceAmount: expense.header.serviceAmount.value,
        totalAmount: expense.header.totalAmount.value,

        userID: expense.header.userID.value,

        items: {
          create: expense.items.map((item) => ({
            id: item.id.value,
            name: item.name,
            quantity: item.quantity,
            singlePrice: item.singlePrice.value,
            totalPrice: item.totalPrice.value,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return new Expense(
      new ExpenseHeader({
        id: new ExpenseID(createdExpense.id),
        dateTime: createdExpense.dateTime,
        vendorName: createdExpense.vendorName,
        category: ExpenseCategory.fromString(createdExpense.category),
        subtotalAmount: Money.newWithDefault(createdExpense.subtotalAmount),
        taxAmount: Money.newWithDefault(createdExpense.taxAmount),
        discountAmount: Money.newWithDefault(createdExpense.discountAmount),
        serviceAmount: Money.newWithDefault(createdExpense.serviceAmount),
        totalAmount: Money.newWithDefault(createdExpense.totalAmount),

        userID: new UserID(createdExpense.userID),
      }),
      createdExpense.items.map(
        (item) =>
          new ExpenseItem({
            id: new ExpenseItemID(item.id),
            name: item.name,
            quantity: item.quantity,
            singlePrice: Money.newWithDefault(item.singlePrice),
            totalPrice: Money.newWithDefault(item.totalPrice),

            expenseID: new ExpenseID(item.expenseID),
          })
      )
    );
  }

  async delete(expenseID: ExpenseID): Promise<void> {
    await this.prisma.expenseHeader.delete({
      where: { id: expenseID.value },
    });
  }
  async findByID(expenseID: ExpenseID): Promise<Expense | null> {
    const foundExpense = await this.prisma.expenseHeader.findUnique({
      where: { id: expenseID.value },
      include: { items: true },
    });

    if (!foundExpense) return null;

    return new Expense(
      new ExpenseHeader({
        id: new ExpenseID(foundExpense.id),
        dateTime: foundExpense.dateTime,
        vendorName: foundExpense.vendorName,
        category: ExpenseCategory.fromString(foundExpense.category),
        subtotalAmount: Money.newWithDefault(foundExpense.subtotalAmount),
        taxAmount: Money.newWithDefault(foundExpense.taxAmount),
        discountAmount: Money.newWithDefault(foundExpense.discountAmount),
        serviceAmount: Money.newWithDefault(foundExpense.serviceAmount),
        totalAmount: Money.newWithDefault(foundExpense.totalAmount),

        userID: new UserID(foundExpense.userID),
      }),
      foundExpense.items.map(
        (item) =>
          new ExpenseItem({
            id: new ExpenseItemID(item.id),
            name: item.name,
            quantity: item.quantity,
            singlePrice: Money.newWithDefault(item.singlePrice),
            totalPrice: Money.newWithDefault(item.totalPrice),

            expenseID: new ExpenseID(item.expenseID),
          })
      )
    );
  }

  async findByDateRange(userID: UserID, from: Date, to: Date): Promise<Expense[]> {
    const startDate = new Date(from);
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    const foundExpenses = await this.prisma.expenseHeader.findMany({
      where: {
        userID: userID.value,
        dateTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { items: true },
    });

    return foundExpenses.map(
      (expense) =>
        new Expense(
          new ExpenseHeader({
            id: new ExpenseID(expense.id),
            dateTime: expense.dateTime,
            vendorName: expense.vendorName,
            category: ExpenseCategory.fromString(expense.category),
            subtotalAmount: Money.newWithDefault(expense.subtotalAmount),
            taxAmount: Money.newWithDefault(expense.taxAmount),
            discountAmount: Money.newWithDefault(expense.discountAmount),
            serviceAmount: Money.newWithDefault(expense.serviceAmount),
            totalAmount: Money.newWithDefault(expense.totalAmount),

            userID: new UserID(expense.userID),
          }),
          expense.items.map(
            (item) =>
              new ExpenseItem({
                id: new ExpenseItemID(item.id),
                name: item.name,
                quantity: item.quantity,
                singlePrice: Money.newWithDefault(item.singlePrice),
                totalPrice: Money.newWithDefault(item.totalPrice),

                expenseID: new ExpenseID(item.expenseID),
              })
          )
        )
    );
  }

  async update(expense: Expense): Promise<Expense> {
    const updatedExpense = await this.prisma.expenseHeader.update({
      where: { id: expense.header.id.value },
      data: {
        dateTime: expense.header.dateTime,
        vendorName: expense.header.vendorName,
        category: expense.header.category.value,
        subtotalAmount: expense.header.subtotalAmount.value,
        taxAmount: expense.header.taxAmount.value,
        discountAmount: expense.header.discountAmount.value,
        serviceAmount: expense.header.serviceAmount.value,
        totalAmount: expense.header.totalAmount.value,

        userID: expense.header.userID.value,

        items: {
          deleteMany: {
            expenseID: expense.header.id.value,
          },
          create: expense.items.map((item) => ({
            id: item.id.value,
            name: item.name,
            quantity: item.quantity,
            singlePrice: item.singlePrice.value,
            totalPrice: item.totalPrice.value,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return new Expense(
      new ExpenseHeader({
        id: new ExpenseID(updatedExpense.id),
        dateTime: updatedExpense.dateTime,
        vendorName: updatedExpense.vendorName,
        category: ExpenseCategory.fromString(updatedExpense.category),
        subtotalAmount: Money.newWithDefault(updatedExpense.subtotalAmount),
        taxAmount: Money.newWithDefault(updatedExpense.taxAmount),
        discountAmount: Money.newWithDefault(updatedExpense.discountAmount),
        serviceAmount: Money.newWithDefault(updatedExpense.serviceAmount),
        totalAmount: Money.newWithDefault(updatedExpense.totalAmount),

        userID: new UserID(updatedExpense.userID),
      }),
      updatedExpense.items.map(
        (item) =>
          new ExpenseItem({
            id: new ExpenseItemID(item.id),
            name: item.name,
            quantity: item.quantity,
            singlePrice: Money.newWithDefault(item.singlePrice),
            totalPrice: Money.newWithDefault(item.totalPrice),

            expenseID: new ExpenseID(item.expenseID),
          })
      )
    );
  }
}
