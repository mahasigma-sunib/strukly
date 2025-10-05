// src/infra/repositories/prisma/wallet.repository.prisma.ts

import { PrismaClient } from "@prisma/client";
import Wallet from "../../domain/entities/wallet";
import { IWalletRepository } from "../../domain/repositories/wallet_repository";
import Money from "../../domain/values/money";
import TransactionMethod from "../../domain/values/transaction_method";
import WalletID from "../../domain/values/wallet_id";
import UserID from "src/domain/values/user_id";

export default class WalletRepositoryPrisma implements IWalletRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const created = await this.prisma.wallet.create({
      data: {
        id: wallet.id.value,
        userID: wallet.userID,
        name: wallet.walletName,
        balance: wallet.balance.value,
        transaction_method: wallet.transactionMethod.value,
      },
    });
    return new Wallet({
      id: { value: created.id },
      userID: created.userID,
      walletName: created.name,
      balance: new Money(created.balance.toNumber(), "idr"),
      transactionMethod: new TransactionMethod(created.transaction_method as any),
    });
  }

  // Tambahkan implementasi untuk metode lainnya
  async findById(walletId: WalletID): Promise<Wallet | null> {
    const found = await this.prisma.wallet.findUnique({
      where: { id: walletId.value},
    });
    if (found === null) return null;
    return new Wallet({
      id: { value: found.id },
      userID: found.userID,
      walletName: found.name,
      balance: new Money(found.balance.toNumber(), "idr"),
      transactionMethod: new TransactionMethod(found.transaction_method as any),
    });
  }

  async findByUser(userId: UserID): Promise<Wallet[]> {
    const wallets = await this.prisma.wallet.findMany({
      where: { userID: userId.value },
    });
    
    const result = wallets.map((w) => new Wallet({
      id: { value: w.id },
      userID: w.userID,
      walletName: w.name,
      balance: new Money(w.balance.toNumber(), "idr"),
      transactionMethod: new TransactionMethod(w.transaction_method as any),
    }));
    return result;
}

  async update(wallet: Wallet): Promise<Wallet> {
    const updated = await this.prisma.wallet.update({
      where: { id: wallet.id.value },
      data: {
        balance: wallet.balance.value,
      },
    });
    return new Wallet({
      id: { value: updated.id },
      userID: updated.userID,
      walletName: updated.name,
      balance: new Money(updated.balance.toNumber(), "idr"),
      transactionMethod: new TransactionMethod(updated.transaction_method as any),
    });
  }

  async delete(walletId: WalletID): Promise<void> {
    await this.prisma.wallet.delete({
      where: { id: walletId.value },
    });
  }
}