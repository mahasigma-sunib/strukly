import WishlistID from "../values/wishlist_id";
import UserID from "../values/user_id";
import Money from "../values/money";

export default class Wishlist {
  readonly id: WishlistID;

  itemName: string;
  itemPrice: Money;
  progress: number;

  readonly createdAt: Date;
  updatedAt: Date

  readonly userID: UserID;

  constructor(props: {
    id: WishlistID;
    itemName: string;
    itemPrice: Money;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
    userID: UserID;
  }) {
    this.id = props.id;
    this.itemName = props.itemName;
    this.itemPrice = props.itemPrice;
    this.progress = props.progress;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.userID = props.userID;
  }

  getWishlistID(): WishlistID {
    return this.id;
  }

  public updateWishlist(data: { itemName?: string; itemPrice?: Money; progress?: number }) {
    if (data.itemName !== undefined) {
      this.itemName = data.itemName;
    }
    if (data.itemPrice !== undefined) {
      this.itemPrice = data.itemPrice;
    }
    if (data.progress !== undefined) {
      this.progress = data.progress;
    }
    this.updatedAt = new Date();
  }
}