// src/application/use_cases/dtos/create_wallet.dto.ts

export type CreateWalletDTO = {
  userId: string;
  walletName: string;
  balance: number;
  transactionMethod: string;
  walletCategory: string;
};