import Transaction from "../../../domain/aggregates/transaction";
import TransactionHeader, {
  ITransactionHeaderBuider,
} from "../../../domain/entities/transaction_header";
import TransactionItem, {
  ITransactionItemEditable,
} from "../../../domain/entities/transaction_item";
import TransactionService from "../../../domain/services/transaction_service";

export default class CreateTransactionUseCase {
  constructor(private readonly transactionService: TransactionService) {}
  async execute(
    transactionHeader: ITransactionHeaderBuider,
    transactionItems: ITransactionItemEditable[]
  ) {
    const newTransaction = new Transaction(
      TransactionHeader.new(transactionHeader),
      []
    );
    for (const item of transactionItems) {
      newTransaction.addItem(
        TransactionItem.new({
          ...item,
          transactionID: newTransaction.getTransactionID(),
        })
      );
    }
    return this.transactionService.createTransaction(newTransaction);
  }
}
