// src/application/use_cases/create_wallet.ts

import Wallet from "../../domain/entities/wallet";
import { IWalletRepository } from "../../domain/repositories/wallet_repository";
import Money from "../../domain/values/money";
import TransactionMethod from "../../domain/values/transaction_method";
import { CreateWalletDTO } from "../../infrastructure/dto/create_wallet_dto";

export class CreateWallet {
  constructor(private readonly walletRepository: IWalletRepository) { }

  async execute(data: CreateWalletDTO): Promise<Wallet> {
    // 1. Buat instance Wallet baru. Gunakan `create` dari kelas Wallet
    const newWallet = Wallet.create({
      userID: data.userId,
      walletName: data.walletName,
      balance: new Money(data.balance, "idr"),
      transactionMethod: new TransactionMethod(data.transactionMethod),
    });

    // 2. Simpan Wallet ke database melalui repositori
    const createdWallet = await this.walletRepository.create(newWallet);

    return createdWallet;
  }
}