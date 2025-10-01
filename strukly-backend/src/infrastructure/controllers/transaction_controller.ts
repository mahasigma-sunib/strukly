import { Request, Response } from "express";
import { CreateTransactionDTO, transactionToDTO } from "../dto/transaction_dto";
import CreateTransactionUseCase from "src/application/use_cases/transaction/create_transaction";

export default class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  public createTransaction = async (req: Request<{},{}, CreateTransactionDTO>, res: Response): Promise<Response> => {
    try {
      const transactionData = req.body;
      const userID = req.user!.id;
      
      const result = await this.createTransactionUseCase.execute(userID, transactionData);
      
      return res.status(201).json({ 
        message: 'Transaction created successfully',
        transaction: transactionToDTO(result), 
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

}