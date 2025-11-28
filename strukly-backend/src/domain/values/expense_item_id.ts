export default class ExpenseItemID {
  constructor(public readonly value: string) { }
  static fromRandom(): ExpenseItemID {
    return new ExpenseItemID(crypto.randomUUID());
  }
}