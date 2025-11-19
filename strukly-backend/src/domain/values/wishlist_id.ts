export default class WishlistID {
  constructor(public readonly value: string) { }
  static fromRandom(): WishlistID {
    return new WishlistID(crypto.randomUUID());
  }
}