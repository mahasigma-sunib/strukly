import { PrismaClient } from "@prisma/client";
import ITransactionRepository from "../../domain/repositories/transaction_repository";
import Transaction from "../../domain/aggregates/transaction";
import TransactionHeader from "../../domain/entities/transaction_header";
import TransactionItem from "../../domain/entities/transaction_item";
import TransactionCategory from "../../domain/values/transaction_category";
import Money from "../../domain/values/money";
import UserID from "../../domain/values/user_id";
import TransactionItemID from "../../domain/values/transaction_item_id";
import TransactionID from "../../domain/values/transaction_id";

export default class PrismaTranactionRepository
  implements ITransactionRepository
{
  private prisma = new PrismaClient();
  constructor() {}
  async create(transaction: Transaction): Promise<Transaction> {
    const createdTransaction = await this.prisma.transactionHeader.create({
      data: {
        id: transaction.header.id.value,
        dateTime: transaction.header.dateTime,
        vendorName: transaction.header.vendorName,
        category: transaction.header.category.value,
        subtotalAmount: transaction.header.subtotalAmount.value,
        taxAmount: transaction.header.taxAmount.value,
        discountAmount: transaction.header.discountAmount.value,
        serviceAmount: transaction.header.serviceAmount.value,
        totalAmount: transaction.header.totalAmount.value,

        userID: transaction.header.userID.value,

        walletID: "", // TODO: WalletID not implemented

        items: {
          create: transaction.items.map((item) => ({
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

    return new Transaction(
       new TransactionHeader({
        id: { value: createdTransaction.id },
        dateTime: createdTransaction.dateTime,
        vendorName: createdTransaction.vendorName,
        category: TransactionCategory.fromString(createdTransaction.category),
        subtotalAmount: Money.newWithDefault(createdTransaction.subtotalAmount),
        taxAmount: Money.newWithDefault(createdTransaction.taxAmount),
        discountAmount: Money.newWithDefault(createdTransaction.discountAmount),
        serviceAmount: Money.newWithDefault(createdTransaction.serviceAmount),
        totalAmount: Money.newWithDefault(createdTransaction.totalAmount),

        userID: new UserID(createdTransaction.userID),

        walletID: "", // TODO: WalletID not implemented
      }),
       createdTransaction.items.map(
        (item) =>
          new TransactionItem({
            id: new TransactionItemID(item.id),
            name: item.name,
            quantity: item.quantity,
            singlePrice: Money.newWithDefault(item.singlePrice),
            totalPrice: Money.newWithDefault(item.totalPrice),

            transactionID: new TransactionID(item.transactionID),
          })
      ),
    );
  }

  async delete(transactionID: TransactionID): Promise<void> {
    await this.prisma.transactionHeader.delete({
      where: { id: transactionID.value },
    });
  }
  async findByID(transactionID: TransactionID): Promise<Transaction | null> {
    const foundTransaction = await this.prisma.transactionHeader.findUnique({
      where: { id: transactionID.value },
      include: { items: true },
    });

    if (!foundTransaction) return null;

    return new Transaction(
      new TransactionHeader({
        id: { value: foundTransaction.id },
        dateTime: foundTransaction.dateTime,
        vendorName: foundTransaction.vendorName,
        category: TransactionCategory.fromString(foundTransaction.category),
        subtotalAmount: Money.newWithDefault(foundTransaction.subtotalAmount),
        taxAmount: Money.newWithDefault(foundTransaction.taxAmount),
        discountAmount: Money.newWithDefault(foundTransaction.discountAmount),
        serviceAmount: Money.newWithDefault(foundTransaction.serviceAmount),
        totalAmount: Money.newWithDefault(foundTransaction.totalAmount),

        userID: new UserID(foundTransaction.userID),

        walletID: "", // TODO: WalletID not implemented
      }),
      foundTransaction.items.map(
        (item) =>
          new TransactionItem({
            id: new TransactionItemID(item.id),
            name: item.name,
            quantity: item.quantity,
            singlePrice: Money.newWithDefault(item.singlePrice),
            totalPrice: Money.newWithDefault(item.totalPrice),

            transactionID: new TransactionID(item.transactionID),
          })
      )
    );
  }
  async findByUserID(userID: UserID): Promise<Transaction[]> {
    const foundTransactions = await this.prisma.transactionHeader.findMany({
      where: { userID: userID.value },
      include: { items: true },
    });

    return foundTransactions.map(
      (transaction) =>
        new Transaction(
          new TransactionHeader({
            id: { value: transaction.id },
            dateTime: transaction.dateTime,
            vendorName: transaction.vendorName,
            category: TransactionCategory.fromString(transaction.category),
            subtotalAmount: Money.newWithDefault(transaction.subtotalAmount),
            taxAmount: Money.newWithDefault(transaction.taxAmount),
            discountAmount: Money.newWithDefault(transaction.discountAmount),
            serviceAmount: Money.newWithDefault(transaction.serviceAmount),
            totalAmount: Money.newWithDefault(transaction.totalAmount),

            userID: new UserID(transaction.userID),

            walletID: "", // TODO: WalletID not implemented
          }),
          transaction.items.map(
            (item) =>
              new TransactionItem({
                id: new TransactionItemID(item.id),
                name: item.name,
                quantity: item.quantity,
                singlePrice: Money.newWithDefault(item.singlePrice),
                totalPrice: Money.newWithDefault(item.totalPrice),

                transactionID: new TransactionID(item.transactionID),
              })
          )
        )
    );
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const updatedTransaction = await this.prisma.transactionHeader.update({
      where: { id: transaction.header.id.value },
      data: {
        dateTime: transaction.header.dateTime,
        vendorName: transaction.header.vendorName,
        category: transaction.header.category.value,
        subtotalAmount: transaction.header.subtotalAmount.value,
        taxAmount: transaction.header.taxAmount.value,
        discountAmount: transaction.header.discountAmount.value,
        serviceAmount: transaction.header.serviceAmount.value,
        totalAmount: transaction.header.totalAmount.value,

        userID: transaction.header.userID.value,

        walletID: "", // TODO: WalletID not implemented

        items: {
          deleteMany: {
            transactionID: transaction.header.id.value,
          },
          create: transaction.items.map((item) => ({
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

    return new Transaction(
      new TransactionHeader({
        id: { value: updatedTransaction.id },
        dateTime: updatedTransaction.dateTime,
        vendorName: updatedTransaction.vendorName,
        category: TransactionCategory.fromString(updatedTransaction.category),
        subtotalAmount: Money.newWithDefault(updatedTransaction.subtotalAmount),
        taxAmount: Money.newWithDefault(updatedTransaction.taxAmount),
        discountAmount: Money.newWithDefault(updatedTransaction.discountAmount),
        serviceAmount: Money.newWithDefault(updatedTransaction.serviceAmount),
        totalAmount: Money.newWithDefault(updatedTransaction.totalAmount),

        userID: new UserID(updatedTransaction.userID),

        walletID: "", // TODO: WalletID not implemented
      }),
      updatedTransaction.items.map(
        (item) =>
          new TransactionItem({
            id: new TransactionItemID(item.id),
            name: item.name,
            quantity: item.quantity,
            singlePrice: Money.newWithDefault(item.singlePrice),
            totalPrice: Money.newWithDefault(item.totalPrice),

            transactionID: new TransactionID(item.transactionID),
          })
      )
    );
  }
}
