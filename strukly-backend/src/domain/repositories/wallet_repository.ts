// src/domain/repositories/wallet_repository.ts

import Wallet from "../entities/wallet";

export interface IWalletRepository {
  create(wallet: Wallet): Promise<Wallet>;
  findById(walletId: number): Promise<Wallet | null>; // Ganti string menjadi number
  findByUser(userId: string): Promise<Wallet[]>;
  update(wallet: Wallet): Promise<Wallet>;
  delete(walletId: number): Promise<void>; // Ganti string menjadi number
}