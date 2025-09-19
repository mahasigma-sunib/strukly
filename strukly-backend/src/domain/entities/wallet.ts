// src/domain/entities/wallet.ts

import Money from "../values/money";
import TransactionMethod from "../values/transaction_method";
import WalletID from "../values/wallet_id";

export type WalletProps = {
  // Gunakan nama yang konsisten dengan Prisma
  id: WalletID;
  userID: string;
  walletName: string;
  balance: Money;
  transactionMethod: TransactionMethod;
};

export default class Wallet {
  public readonly id: WalletID;
  public readonly userID: string;
  public walletName: string;
  public transactionMethod: TransactionMethod;
  private _balance: Money;

  constructor(props: WalletProps) {
    this.id = props.id;
    this.userID = props.userID;
    this.walletName = props.walletName;
    this._balance = props.balance;
    this.transactionMethod = props.transactionMethod;
  }

   static create(props: Omit<WalletProps, "id">): Wallet {
    return new Wallet({
      ...props,
      id: WalletID.fromRandom(),
    });
  }

  get balance(): Money {
    return this._balance;
  }
}