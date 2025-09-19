export default class WalletID {
  constructor(public readonly value: string) { }
  static fromRandom(): WalletID {
    return new WalletID(crypto.randomUUID());
  }
}