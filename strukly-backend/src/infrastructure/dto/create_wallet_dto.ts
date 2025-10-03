// src/application/use_cases/dtos/create_wallet.dto.ts

import Wallet from "../../domain/entities/wallet";
import { ETransactionMethod } from "../../domain/values/transaction_method";


export type CreateWalletDTO = {
  userId: string;
  walletName: string;
  transactionMethod: ETransactionMethod;
  balance: number;
};

export interface WalletDTO extends CreateWalletDTO {
  walletId: string;
}

export function WalletToDTO(wallet: Wallet): WalletDTO {
  return {
    walletId: wallet.id.value,
    userId: wallet.userID,
    walletName: wallet.walletName,
    transactionMethod: wallet.transactionMethod.value,
    balance: wallet.balance.value,
  }
}