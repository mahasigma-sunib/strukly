export default class TransactionItemID {
  constructor(public readonly value: string) { }
  static fromRandom(): TransactionItemID {
    return new TransactionItemID(crypto.randomUUID());
  }
}