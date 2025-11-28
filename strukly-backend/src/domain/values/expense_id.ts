export default class ExpenseID {
  constructor(public readonly value: string) {}
  static fromRandom(): ExpenseID {
    return new ExpenseID(crypto.randomUUID());
  }
}
