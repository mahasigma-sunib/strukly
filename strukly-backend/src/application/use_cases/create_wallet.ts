// src/application/use_cases/create_wallet.ts

import Wallet from "../../domain/entities/wallet";
import { IWalletRepository } from "../../domain/repositories/wallet_repository";
import { CreateWalletDTO } from "../../infrastructure/dto/create_wallet_dto";

export class CreateWallet {
  private walletRepository: IWalletRepository;

  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(data: CreateWalletDTO): Promise<Wallet> {
    // 1. Buat instance Wallet baru. Gunakan `create` dari kelas Wallet
    const newWallet = Wallet.create({
      userId: data.userId,
      walletName: data.walletName,
      balance: data.balance,
      transactionMethod: data.transactionMethod,
      walletCategory: data.walletCategory,
    });

    // 2. Simpan Wallet ke database melalui repositori
    const createdWallet = await this.walletRepository.create(newWallet);

    return createdWallet;
  }
}