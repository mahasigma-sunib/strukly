import Transaction from "src/domain/aggregates/transaction";
import { CreateTransactionDTO } from "src/infrastructure/dto/transaction_dto";

export default interface LanguageModelService {
  imageToTransaction: (base64Image: string) => Promise<Omit<CreateTransactionDTO, 'walletID'>>;
}