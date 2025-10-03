import { CreateTransactionDTO } from "src/infrastructure/dto/transaction_dto";
import Transaction from "src/domain/aggregates/transaction";
import TransactionHeader from "src/domain/entities/transaction_header";
import TransactionItem from "src/domain/entities/transaction_item";
import TransactionCategory from "src/domain/values/transaction_category";
import Money from "src/domain/values/money";
import UserID from "src/domain/values/user_id";

export default class TransactionMapper {
	/**
	 * Map a CreateTransactionDTO + userID into a domain Transaction aggregate.
	 * Assumes the incoming DTO has already been validated by the controller layer.
	 */
	static fromCreateDTO(userID: string, dto: CreateTransactionDTO): Transaction {
		const newTransaction = new Transaction(
			TransactionHeader.new({
				userID: new UserID(userID),

				dateTime: new Date(dto.dateTime),
				vendorName: dto.vendorName,
				category: TransactionCategory.fromString(dto.category),
				subtotalAmount: Money.newWithDefault(dto.subtotalAmount.amount),
				taxAmount: Money.newWithDefault(dto.taxAmount.amount),
				discountAmount: Money.newWithDefault(dto.discountAmount.amount),
				serviceAmount: Money.newWithDefault(dto.serviceAmount.amount),

				walletID: dto.walletID,
			}),
			[]
		);

		for (const item of dto.items) {
			newTransaction.addItem(
				TransactionItem.new({
					name: item.name,
					quantity: item.quantity,
					singlePrice: Money.newWithDefault(item.singlePrice.amount),
					transactionID: newTransaction.getTransactionID(),
				})
			);
		}

		return newTransaction;
	}
}