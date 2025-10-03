export default class UserID {
  constructor(public readonly value: string) { }
  static fromRandom(): UserID {
    return new UserID(crypto.randomUUID());
  }

  equals(other: UserID): boolean {
    return this.value === other.value;
  }
}