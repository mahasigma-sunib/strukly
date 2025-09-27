import { PrismaClient } from "@prisma/client";
import ITransactionRepository from "../../domain/repositories/transaction_repository";

export default class transactionRepository implements ITransactionRepository {
  constructor() { }
  async createTransaction(): Promise<any> {
    const prisma = new PrismaClient();
    // TODO: implement transaction repository
    await prisma.$disconnect();
  }
}