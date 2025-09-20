// src/domain/repositories/wallet_repository.ts

import Wallet from "../entities/wallet";
import UserID from "../values/user_id";
import WalletID from "../values/wallet_id";

export interface IWalletRepository {
  create(wallet: Wallet): Promise<Wallet>;
  findById(walletId: WalletID): Promise<Wallet | null>; // Ganti string menjadi number
  findByUser(userId: UserID): Promise<Wallet[]>;
  update(wallet: Wallet): Promise<Wallet>;
  delete(walletId: WalletID): Promise<void>; // Ganti string menjadi number
}