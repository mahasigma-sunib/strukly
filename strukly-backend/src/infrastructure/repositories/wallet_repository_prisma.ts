// src/infra/repositories/prisma/wallet.repository.prisma.ts

import { PrismaClient } from "@prisma/client";
import  Wallet  from "../../domain/entities/wallet";
import { IWalletRepository } from "../../domain/repositories/wallet_repository";

// Pastikan PrismaClient di-inject melalui konstruktor
export default class WalletRepositoryPrisma implements IWalletRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const created = await this.prisma.wallet.create({
      data: {
        id: wallet.id,
        user_id: wallet.userId,
        wallet_name: wallet.walletName,
        balance: wallet.balance,
        transaction_method: wallet.transactionMethod,
        wallet_category: wallet.walletCategory,
      },
    });
    return Wallet.fromPrisma(created);
  }

  // Tambahkan implementasi untuk metode lainnya
  async findById(walletId: number): Promise<Wallet | null> {
    const found = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
    return found ? Wallet.fromPrisma(found) : null;
  }

  async findByUser(userId: string): Promise<Wallet[]> {
    const wallets = await this.prisma.wallet.findMany({
      where: { user_id: userId },
    });
    return wallets.map(w => Wallet.fromPrisma(w));
  }

  async update(wallet: Wallet): Promise<Wallet> {
    const updated = await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        // Hanya update properti yang diperlukan
        balance: wallet.balance,
      },
    });
    return Wallet.fromPrisma(updated);
  }

  async delete(walletId: number): Promise<void> {
    await this.prisma.wallet.delete({
      where: { id: walletId },
    });
  }
}