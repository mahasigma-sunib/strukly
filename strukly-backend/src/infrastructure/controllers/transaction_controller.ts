import { Request, Response } from "express";
import { CreateTransactionDTO, TransactionDTO, transactionToDTO } from "../dto/transaction_dto";
import CreateTransactionUseCase from "src/application/use_cases/transaction/create_transaction";
import GetTransactionListUseCase from "src/application/use_cases/transaction/get_transaction_list";
import GetTransactionDetailUseCase from "src/application/use_cases/transaction/get_transaction_detail";
import UpdateTransactionUseCase from "src/application/use_cases/transaction/update_transaction";

export default class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionListUseCase: GetTransactionListUseCase,
    private readonly getTransactionDetailUseCase: GetTransactionDetailUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) { }

  public createTransaction = async (req: Request<{}, {}, CreateTransactionDTO>, res: Response): Promise<Response> => {
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

  public getTransactionList = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userID = req.user!.id;

      const transactions = await this.getTransactionListUseCase.execute(userID);

      const transactionDTOs = transactions.map(transactionToDTO);

      return res.status(200).json({ transactions: transactionDTOs });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getTransactionDetail = async (req: Request<{ transactionID: string }>, res: Response): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { transactionID } = req.params;


      const transaction = await this.getTransactionDetailUseCase.execute(userID, transactionID);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      return res.status(200).json({ transaction: transactionToDTO(transaction) });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  public updateTransaction = async (req: Request<{ transactionID: string }, {}, TransactionDTO>, res: Response): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { transactionID } = req.params;
      const transactionData = req.body;

      if (transactionID !== transactionData.id) {
        return res.status(400).json({ error: 'Transaction ID in URL does not match ID in body' });
      }

      const updatedTransaction = await this.updateTransactionUseCase.execute(userID, transactionData);

      return res.status(200).json({
        message: 'Transaction updated successfully',
        transaction: transactionToDTO(updatedTransaction),
      });
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}