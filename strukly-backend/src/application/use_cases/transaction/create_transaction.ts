import { CreateTransactionDTO } from "src/infrastructure/dto/transaction_dto";
import Transaction from "../../../domain/aggregates/transaction";
import TransactionHeader, {
  ITransactionHeaderBuider,
} from "../../../domain/entities/transaction_header";
import TransactionItem, {
  ITransactionItemEditable,
} from "../../../domain/entities/transaction_item";
import TransactionService from "../../../domain/services/transaction_service";
import TransactionCategory from "src/domain/values/transaction_category";
import Money from "src/domain/values/money";
import UserID from "src/domain/values/user_id";

export default class CreateTransactionUseCase {
  constructor(private readonly transactionService: TransactionService) {}
  async execute(
    userID: string,
    transaction: CreateTransactionDTO,
    // transactionHeader: ITransactionHeaderBuider,
    // transactionItems: ITransactionItemEditable[]
  ) {

    const newTransaction = new Transaction(
      TransactionHeader.new({
        userID: new UserID(userID),

        dateTime: new Date(transaction.dateTime),
        vendorName: transaction.vendorName,
        category: TransactionCategory.fromString(transaction.category),
        subtotalAmount: Money.newWithDefault(transaction.subtotalAmount.amount),
        taxAmount: Money.newWithDefault(transaction.taxAmount.amount),
        discountAmount: Money.newWithDefault(transaction.discountAmount.amount),
        serviceAmount: Money.newWithDefault(transaction.serviceAmount.amount),

        walletID: transaction.walletID,
      }),
      []
    );
    for (const item of transaction.items) {
      newTransaction.addItem(
        TransactionItem.new({
          name: item.name,
          quantity: item.quantity,
          singlePrice: Money.newWithDefault(item.singlePrice.amount),
          transactionID: newTransaction.getTransactionID(),
        })
      );
    }
    return this.transactionService.createTransaction(newTransaction);
  }
}
