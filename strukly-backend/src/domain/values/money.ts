const DEFAULT_CURRENCY = "idr";

export default class Money {
  constructor(public readonly value: number, public readonly currency: string) { }
  static newWithDefault(value: number) {
    return new Money(value, DEFAULT_CURRENCY);
  }
  static sum(moneys: Money[]) {
    let totalValue = 0;
    for (const money of moneys) {
      // TODO: convert money to default currency
      totalValue += money.value;
    }
    return new Money(totalValue, DEFAULT_CURRENCY);
  }
  static negate(money: Money) {
    return new Money(-money.value, money.currency);
  }
}