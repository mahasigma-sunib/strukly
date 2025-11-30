export default class UserID {
  constructor(public readonly value: string) { }
  static fromRandom(): UserID {
    return new UserID(crypto.randomUUID());
  }

  public equals(other: UserID): boolean {
    if (!other) return false;
    return this.value === other.value;
  }
}