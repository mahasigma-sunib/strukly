export default class TransactionID {
  constructor(public readonly value: string) { }
  static fromRandom(): TransactionID {
    return new TransactionID(crypto.randomUUID());
  }
}