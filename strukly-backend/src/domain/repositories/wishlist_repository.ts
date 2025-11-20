import Wishlist from "../aggregates/wishlist";
import WishlistID from "../values/wishlist_id";
import UserID from "../values/user_id";

export interface IWishlistRepository {
    create: (wishlist: Wishlist) => Promise<Wishlist>;
    delete: (wishlistID: WishlistID) => Promise<void>;
    findByID: (wishlistID: WishlistID) => Promise<Wishlist | null>;
    update: (wishlist: Wishlist) => Promise<Wishlist>;
    getAll: (userID: UserID) => Promise<Wishlist[]>;
}