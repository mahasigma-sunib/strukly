// src/domain/entities/wallet.ts
import { randomUUID } from "crypto";

export type WalletProps = {
  walletId: string;
  userId: string;
  walletName: string;
  walletBalance: number;
};

export default class Wallet {
  public readonly walletId: string;
  public readonly userId: string;
  public walletName: string;
  private _walletBalance: number;

  constructor(props: WalletProps) {
    this.walletId = props.walletId;
    this.userId = props.userId;
    this.walletName = props.walletName;
    this._walletBalance = props.walletBalance;
  }

  static create(props: Omit<WalletProps, "walletId">): Wallet {
    return new Wallet({
      ...props,
      walletId: randomUUID(),
    });
  }

  get walletBalance(): number {
    return this._walletBalance;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Jumlah deposit harus lebih dari 0");
    this._walletBalance += amount;
  }

  
  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Jumlah withdraw harus lebih dari 0");
    if (amount > this._walletBalance) throw new Error("Saldo tidak mencukupi");
    this._walletBalance -= amount;
  }

}
