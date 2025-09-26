import Transaction from "../../../domain/aggregates/transaction";
import TransactionDescriptor, {
  ITransactionDescriptorBuider,
} from "../../../domain/entities/transaction_descriptor";
import TransactionItem, {
  ITransactionItemEditable,
} from "../../../domain/entities/transaction_item";
import TransactionService from "../../../domain/services/transaction_service";

export default class CreateTransactionUseCase {
  constructor(private readonly transactionService: TransactionService) {}
  async execute(
    transactionDescriptor: ITransactionDescriptorBuider,
    transactionItems: ITransactionItemEditable[]
  ) {
    const newTransaction = new Transaction(
      TransactionDescriptor.new(transactionDescriptor),
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
