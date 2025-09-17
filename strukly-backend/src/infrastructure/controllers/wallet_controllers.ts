// src/infrastructure/controllers/wallet.controller.ts (Contoh)
import { CreateWallet } from "../../application/use_cases/create_wallet";
import  WalletRepositoryPrisma   from "../repositories/wallet_repository_prisma";
import { PrismaClient } from "@prisma/client";

// Injeksi dependensi
const prisma = new PrismaClient();
const walletRepository = new WalletRepositoryPrisma(prisma);
const createWalletUseCase = new CreateWallet(walletRepository);

import { Request, Response } from "express";

// Contoh endpoint API (misalnya dengan Express.js)
async function createWalletHandler(req: Request, res: Response) {
  try {
    const { userId, walletName, balance, transactionMethod, walletCategory } = req.body;
    const newWallet = await createWalletUseCase.execute({
      userId,
      walletName,
      balance,
      transactionMethod,
      walletCategory,
    });
    res.status(201).json(newWallet);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: String(error) });
    }
  }
}