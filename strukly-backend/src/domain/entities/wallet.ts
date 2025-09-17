// src/domain/entities/wallet.ts

export type WalletProps = {
  // Gunakan nama yang konsisten dengan Prisma
  id: number;
  userId: string;
  walletName: string;
  balance: number;
  transactionMethod: string;
  walletCategory: string;
};

export default class Wallet {
  public readonly id: number;
  public readonly userId: string;
  public walletName: string;
  public transactionMethod: string;
  public walletCategory: string;
  private _balance: number;

  constructor(props: WalletProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.walletName = props.walletName;
    this._balance = props.balance;
    this.transactionMethod = props.transactionMethod;
    this.walletCategory = props.walletCategory;
  }

   static create(props: Omit<WalletProps, "id">): Wallet {
    return new Wallet({
      ...props,
      id: 0,
    });
  }

  // Tambahkan metode fromPrisma untuk konversi dari objek Prisma
  static fromPrisma(data: any): Wallet {
    return new Wallet({
      id: data.id,
      userId: data.user_id,
      walletName: data.wallet_name,
      balance: data.balance,
      transactionMethod: data.transaction_method,
      walletCategory: data.wallet_category,
    });
  }

  get balance(): number {
    return this._balance;
  }
}