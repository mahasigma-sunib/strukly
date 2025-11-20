// src/domain/entities/goal_item.ts

import WishlistID from "../values/wishlist_id";
import UserID from "../values/user_id";
import Money from "../values/money";

export interface IWishlistEditable {
  itemName: string;
  itemPrice: Money;
  progress: number;
}

export interface IWishlistBuilder extends IWishlistEditable {
  userID: UserID;
}

export interface IWishlistProps extends IWishlistBuilder {
  id: WishlistID;
}

export default class Wishlist {
  public readonly id: WishlistID;

  public readonly itemName: string;
  public readonly itemPrice: Money;
  public readonly progress: number;

  public readonly userID: UserID;

  constructor(props: IWishlistProps) {
    this.id = props.id;
    this.itemName = props.itemName;
    this.itemPrice = props.itemPrice;
    this.progress = props.progress;
    this.userID = props.userID;
  }

  static new(props: IWishlistBuilder): Wishlist {
    return new Wishlist({
      ...props,
      id: WishlistID.fromRandom(),
    });
  }
}