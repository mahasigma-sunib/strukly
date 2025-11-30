// src/domain/values/goal_item_id.ts

export default class GoalItemID {
  constructor(public readonly value: string) { }
  static fromRandom(): GoalItemID {
    return new GoalItemID(crypto.randomUUID());
  }
  public equals(other: GoalItemID): boolean {
    if (!other) return false;
    return this.value === other.value;
  }
}