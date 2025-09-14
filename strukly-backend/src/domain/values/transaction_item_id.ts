export default class TransactionItemID {
  constructor(public readonly id: string) { }
  static fromRandom(): TransactionItemID {
    return new TransactionItemID(crypto.randomUUID());
  }
}