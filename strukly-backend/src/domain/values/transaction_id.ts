export default class TransactionID {
  constructor(public readonly id: string) { }
  static fromRandom(): TransactionID {
    return new TransactionID(crypto.randomUUID());
  }
}